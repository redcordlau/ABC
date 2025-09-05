package bnp.cib.fresh.teasystemapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class EventRespDto {

	private String organizer;

	private String date;
	
	private String descp;
	
	private String restaurantName;
	
	private String menuImgUrl;
	
	private Boolean isClosed;

}
