# EC2 deployment and local ELK logging

## Deployment flow

Jenkins runs on the EC2 host and uses that host's Docker Engine. A pipeline build creates backend and frontend images, tags them with the checked-out Git commit, pushes them to Docker Hub, and starts the tagged images with `docker-compose.production.yaml`. MySQL data is stored in the persistent `mysql-data` volume; it is not part of either application image.

This is a simple starter topology, not a highly available setup. Jenkins and the application share one host, so Jenkins jobs have root-equivalent access through Docker and a host failure takes down both the deployment service and app.

## EC2 and Jenkins prerequisites

1. Create an EC2 Linux instance with enough disk for Jenkins, Docker image builds, and MySQL. Install Java supported by your Jenkins release, Jenkins, Docker Engine, and the Docker Compose v2 plugin. Start and enable Jenkins and Docker.
2. Add the Jenkins service account to the `docker` group and restart Jenkins. This grants Jenkins root-equivalent host access; restrict who can edit or run pipeline jobs.
3. In the EC2 security group, allow inbound SSH (22) only from your IP and HTTP (80) from the intended app users. Do not open Jenkins (8080), MySQL (3306), or Logstash (5044) to the public internet.
   To reach Jenkins privately, forward its port over SSH with `ssh -L 8080:127.0.0.1:8080 <ssh-user>@<ec2-public-ip>` and open `http://localhost:8080` on your computer.
4. Create `/etc/tutorial-app/deploy.env`, readable by the Jenkins service account and not checked into Git. For example:

   ```dotenv
   MYSQL_DATABASE=tutorialapp_db
   MYSQL_USER=tutorialapp_user
   MYSQL_PASSWORD=replace-with-a-strong-unique-password
   MYSQL_ROOT_PASSWORD=replace-with-another-strong-unique-password
   LOGSTASH_HOST=100.x.y.z
   # Optional:
   APP_HTTP_PORT=80
   ELASTIC_VERSION=8.17.0
   ```

   `LOGSTASH_HOST` is the local computer's Tailscale IP. Set `ELASTIC_VERSION` to a Filebeat release compatible with the Elastic Stack version already running locally.
5. Create a Jenkins **Username with password** credential with ID `dockerhub-creds`. Use a Docker Hub access token as its password. Create Docker Hub repositories named `tutorial-app-api` and `tutorial-app-frontend` under that username.
6. Create a Jenkins Pipeline job for this Git repository and configure it to load the repository's `Jenkinsfile`. Ensure the Jenkins account can read `/etc/tutorial-app/deploy.env` and write `/var/lib/jenkins/deployments`.
7. Run the job. It publishes immutable commit-tagged images and deploys them. The frontend listens on EC2 port 80; the API and database are not published on host ports.

For private Docker Hub repositories, Jenkins logs in before pulling and deploying the images. Keep the Docker Hub access token in Jenkins credentials, not in the repository or `deploy.env`.

## Sending EC2 container logs to local ELK

The Filebeat service in the production Compose file tails logs from containers in the `tutorial-app` Compose project and sends them to Logstash on TCP port 5044. The private Tailscale network provides the route between EC2 and your computer; your computer must be powered on, connected to Tailscale, and running Logstash for uninterrupted delivery. Filebeat retries when the destination is unavailable, but its local disk queue is not enabled by this starter configuration.

1. Install and sign in to Tailscale on both EC2 and your local computer, in the same tailnet. Keep Tailscale running on both. Use the local computer's Tailscale IP as `LOGSTASH_HOST`.
2. Configure the local Logstash instance to accept Beats input on port 5044. Add this input to its pipeline:

   ```conf
   input {
     beats {
       host => "0.0.0.0"
       port => 5044
     }
   }
   ```

   Keep the pipeline's existing Elasticsearch output so the received events are indexed in your local Elasticsearch. If Logstash runs in Docker, publish port 5044 from the Logstash container and ensure the host firewall permits it only from the EC2 Tailscale address. Do not expose this port on a public interface.
3. Restrict access to port 5044 to the EC2 device in your Tailscale access policy/firewall. Tailscale encrypts traffic between devices, but access should still be limited to the devices that need it.
4. Restart Logstash after changing its pipeline, then run the Jenkins pipeline. Confirm Filebeat is running with `docker compose --project-name tutorial-app --env-file /etc/tutorial-app/deploy.env --file /var/lib/jenkins/deployments/tutorial-app/docker-compose.production.yaml logs filebeat`.
5. In Kibana, create a data view matching the index pattern used by your Logstash Elasticsearch output, then inspect Discover. The application logs are container stdout/stderr; they will not arrive in Elasticsearch until Logstash has a working Elasticsearch output.

Local ELK is useful for learning and a personal setup, but it is not a reliable always-on production monitoring destination. If your computer sleeps or leaves Tailscale, logs cannot be viewed live there. For production availability, move Elasticsearch/Kibana/Logstash to an always-on secured host or managed Elastic service.

## Rollback

Each deployment uses a Git commit tag. To roll back, redeploy a previous commit through Jenkins so the previous image tags are pulled and started. Do not remove the `mysql-data` volume when rolling back.
