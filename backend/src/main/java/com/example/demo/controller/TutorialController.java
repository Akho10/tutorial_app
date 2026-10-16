package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.Tutorial;
import com.example.demo.persistence.TutorialRepository;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class TutorialController {

	@Autowired
	  TutorialRepository tutorialRepository;
	
	//use responseentity to decide what http response angular receives

	  @GetMapping("/tutorials")
	  public ResponseEntity<List<Tutorial>> getAllTutorials(@RequestParam(required = false) String title) {
		  
		  try {
			  List<Tutorial> tutorials = new ArrayList<Tutorial>();
			  
			  if(title == null) {
				  tutorialRepository.findAll().forEach(tutorials::add);
			  }else {
				  tutorialRepository.findByTitleContaining(title).forEach(tutorials::add);
			  }
			  
			  if(tutorials.isEmpty()) {
				 return new ResponseEntity<>( HttpStatus.NO_CONTENT);
			  }
			  
			  return new ResponseEntity<>(tutorials,HttpStatus.OK);
			  
		  }catch(Exception e) {
			  return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		  }
	  }

	  @GetMapping("/tutorials/{id}")
	  public ResponseEntity<Tutorial> getTutorialById(@PathVariable("id") long id) {

	      try {
	          Tutorial tutorial =
	                  tutorialRepository.findById(id).orElse(null);

	          if (tutorial == null) {
	              return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	          }

	          return new ResponseEntity<>(tutorial, HttpStatus.OK);

	      } catch (Exception e) {
	          return new ResponseEntity<>(
	                  HttpStatus.INTERNAL_SERVER_ERROR
	          );
	      }
	  }

	  @PostMapping("/tutorials")
	  public ResponseEntity<Tutorial> createTutorial(@RequestBody Tutorial tutorial) {

	      try {

	          Tutorial savedTutorial = tutorialRepository.save(tutorial);

	          return new ResponseEntity<>(savedTutorial,HttpStatus.CREATED
	          );

	      } catch (Exception e) {

	          return new ResponseEntity<>( HttpStatus.INTERNAL_SERVER_ERROR);
	      }
	  }

	  @PutMapping("/tutorials/{id}")
	  public ResponseEntity<Tutorial> updateTutorial(@PathVariable("id") long id,@RequestBody Tutorial tutorial) {

	      try {

	          Tutorial existingTutorial =tutorialRepository.findById(id).orElse(null);

	          if (existingTutorial == null) {

	              return new ResponseEntity<>(HttpStatus.NOT_FOUND
	              );
	          }

	          existingTutorial.setTitle(tutorial.getTitle());

	          existingTutorial.setDescription(tutorial.getDescription());

	          existingTutorial.setPublished(tutorial.isPublished());
	          

	          Tutorial updatedTutorial =tutorialRepository.save(existingTutorial);

	          return new ResponseEntity<>(updatedTutorial,HttpStatus.OK);

	      } catch (Exception e) {

	          return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	      }
	  }

	  @DeleteMapping("/tutorials/{id}")
	  public ResponseEntity<Void> deleteTutorial(@PathVariable("id") long id) {

	      try {

	          Tutorial tutorial =
	                  tutorialRepository.findById(id).orElse(null);

	          if (tutorial == null) {

	              return new ResponseEntity<>(
	                      HttpStatus.NOT_FOUND
	              );
	          }

	          tutorialRepository.deleteById(id);

	          return new ResponseEntity<>(
	                  HttpStatus.NO_CONTENT
	          );

	      } catch (Exception e) {

	          return new ResponseEntity<>(
	                  HttpStatus.INTERNAL_SERVER_ERROR
	          );
	      }
	  }

	  @DeleteMapping("/tutorials")
	  public ResponseEntity<Void> deleteAllTutorials() {

	      try {

	          tutorialRepository.deleteAll();

	          return new ResponseEntity<>(
	                  HttpStatus.NO_CONTENT
	          );

	      } catch (Exception e) {

	          return new ResponseEntity<>(
	                  HttpStatus.INTERNAL_SERVER_ERROR
	          );
	      }
	  }

	  @GetMapping("/tutorials/published")
	  public ResponseEntity<List<Tutorial>> findByPublished() {

	      try {

	          List<Tutorial> tutorials =
	                  tutorialRepository.findByPublished(true);

	          if (tutorials.isEmpty()) {

	              return new ResponseEntity<>(
	                      HttpStatus.NO_CONTENT
	              );
	          }

	          return new ResponseEntity<>(
	                  tutorials,
	                  HttpStatus.OK
	          );

	      } catch (Exception e) {

	          return new ResponseEntity<>(
	                  HttpStatus.INTERNAL_SERVER_ERROR
	          );
	      }
	  }
}
