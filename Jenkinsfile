pipeline {
    agent any

    options {
        disableConcurrentBuilds()
    }

    environment {
        DEPLOY_DIR = '/var/lib/jenkins/deployments/tutorial-app'
        DEPLOY_ENV_FILE = '/etc/tutorial-app/deploy.env'
    }

    stages {
        stage('Build, push, and deploy') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_PASSWORD'
                )]) {
                    sh '''
                        set -eu

                        test -r "$DEPLOY_ENV_FILE"
                        export IMAGE_TAG="$(git rev-parse --short=12 HEAD)"

                        printf '%s' "$DOCKERHUB_PASSWORD" |
                            docker login --username "$DOCKERHUB_USERNAME" --password-stdin
                        trap 'docker logout >/dev/null 2>&1 || true' EXIT

                        docker build --pull \
                            --tag "$DOCKERHUB_USERNAME/tutorial-app-api:$IMAGE_TAG" \
                            ./backend
                        docker build --pull \
                            --tag "$DOCKERHUB_USERNAME/tutorial-app-frontend:$IMAGE_TAG" \
                            ./frontend

                        docker push "$DOCKERHUB_USERNAME/tutorial-app-api:$IMAGE_TAG"
                        docker push "$DOCKERHUB_USERNAME/tutorial-app-frontend:$IMAGE_TAG"

                        install -d "$DEPLOY_DIR"
                        install -m 0644 docker-compose.production.yaml \
                            "$DEPLOY_DIR/docker-compose.production.yaml"
                        install -m 0644 filebeat/filebeat.yml "$DEPLOY_DIR/filebeat.yml"

                        export COMPOSE_PROJECT_NAME=tutorial-app
                        docker compose \
                            --project-name "$COMPOSE_PROJECT_NAME" \
                            --env-file "$DEPLOY_ENV_FILE" \
                            --file "$DEPLOY_DIR/docker-compose.production.yaml" \
                            pull
                        docker compose \
                            --project-name "$COMPOSE_PROJECT_NAME" \
                            --env-file "$DEPLOY_ENV_FILE" \
                            --file "$DEPLOY_DIR/docker-compose.production.yaml" \
                            up --detach --remove-orphans
                    '''
                }
            }
        }
    }
}
