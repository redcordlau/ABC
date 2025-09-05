package bnp.cib.fresh.teasystemapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class OrderDto {

	private Integer id;
	
	private String user;

	private String orderDisplay;
	
	private String remark;
	
	private Integer eventId;
	
	private Integer categoryId;
	
	private Integer itemId;

}
