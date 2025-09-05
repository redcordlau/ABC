package bnp.cib.fresh.teasystemapi.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "tea_order")
@Table(indexes = { @Index(columnList = "eventId"), })
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	private String user;

	private Integer eventId;

	private String orderDisplay;

	private Integer itemId;
	
	private Integer categoryId;

	private String remark;
}