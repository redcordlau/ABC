package bnp.cib.fresh.teasystemapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class MemberRespDto {

	private String uid;

	private String name;

}
