package bnp.cib.fresh.teasystemapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import bnp.cib.fresh.teasystemapi.entity.MemberEntity;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, String> {

}
