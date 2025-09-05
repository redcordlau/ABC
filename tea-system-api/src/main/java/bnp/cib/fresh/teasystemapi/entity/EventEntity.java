package bnp.cib.fresh.teasystemapi.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

@Entity(name = "Event")
@Getter
@Setter
public class EventEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	private String organizer;

	private String date;
	
	private String description;
	
	private Integer restaurantId;
	
	private Boolean isClosed;

}