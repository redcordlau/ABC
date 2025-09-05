package bnp.cib.fresh.teasystemapi.controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import bnp.cib.fresh.teasystemapi.dto.EventRespDto;
import bnp.cib.fresh.teasystemapi.dto.MemberRespDto;
import bnp.cib.fresh.teasystemapi.dto.OrderDto;
import bnp.cib.fresh.teasystemapi.svc.TeaSystemService;
import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin
@Slf4j
@RequestMapping(value = "/")
public class TeaSystemApi {

	@Autowired
	private TeaSystemService teaSystemService;

	@GetMapping(value = "/member/all")
	public ResponseEntity<List<MemberRespDto>> getAllSeats() {

		return new ResponseEntity<>(teaSystemService.getAllMembers(), HttpStatus.OK);
	}

	@GetMapping(value = "/event")
	public ResponseEntity<EventRespDto> getEventById(@RequestParam Integer id) {

		return new ResponseEntity<>(teaSystemService.getEvent(id), HttpStatus.OK);
	}

	@GetMapping(value = "/order")
	public ResponseEntity<List<OrderDto>> getOrderByEventId(@RequestParam Integer eventId) {
		return new ResponseEntity<>(teaSystemService.getOrderyByEvent(eventId), HttpStatus.OK);
	}

	@GetMapping(value = "/restaurant/menu")
	public ResponseEntity<Object> getMenuByRestaurantId(@RequestParam Integer eventId, @RequestParam(required = false) boolean isEng)
			throws IOException, URISyntaxException {
		return new ResponseEntity<Object>(teaSystemService.getRestaurantMenu(eventId, isEng), HttpStatus.OK);
	}

	@PostMapping(value = "/order/save")
	public ResponseEntity<OrderDto> saveOrder(@RequestBody OrderDto orderDto, HttpServletRequest request) {
		String action = orderDto.getId() == null ? "Create" : "Update";
		HttpStatus status = orderDto.getId() == null ? HttpStatus.CREATED : HttpStatus.OK;
		log.info("{} - [{}] [{}] [{}]", action, orderDto.getUser(), orderDto.getOrderDisplay(), request.getRemoteAddr());
		return new ResponseEntity<>(teaSystemService.saveOrder(orderDto), status);
	}

	@PostMapping(value = "/order/delete")
	public ResponseEntity<OrderDto> deleteOrder(@RequestBody OrderDto orderDto, HttpServletRequest request) {
		log.info("Delete - [{}] [{}] [{}]", orderDto.getUser(), orderDto.getOrderDisplay(), request.getRemoteAddr());
		return new ResponseEntity<>(teaSystemService.deleteOrder(orderDto), HttpStatus.OK);
	}
}
