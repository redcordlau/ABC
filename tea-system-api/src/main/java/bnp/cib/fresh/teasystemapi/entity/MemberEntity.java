package bnp.cib.fresh.teasystemapi.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "Member")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberEntity {

	@Id
	private String uid;

	private String name;

}
