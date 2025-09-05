package bnp.cib.fresh.teasystemapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import bnp.cib.fresh.teasystemapi.entity.OrderEntity;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {

	public List<OrderEntity> findByEventId(Integer eventId);
}
