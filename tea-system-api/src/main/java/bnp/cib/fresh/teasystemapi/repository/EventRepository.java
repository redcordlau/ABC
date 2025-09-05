package bnp.cib.fresh.teasystemapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import bnp.cib.fresh.teasystemapi.entity.EventEntity;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Integer> {

}
