package bnp.cib.fresh.teasystemapi.svc;

import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.hc.client5.http.auth.AuthScope;
import org.apache.hc.client5.http.auth.CredentialsProvider;
import org.apache.hc.client5.http.auth.StandardAuthScheme;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.auth.CredentialsProviderBuilder;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpHost;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.message.StatusLine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bnp.cib.fresh.teasystemapi.dto.EventRespDto;
import bnp.cib.fresh.teasystemapi.dto.MemberRespDto;
import bnp.cib.fresh.teasystemapi.dto.OrderDto;
import bnp.cib.fresh.teasystemapi.entity.EventEntity;
import bnp.cib.fresh.teasystemapi.entity.OrderEntity;
import bnp.cib.fresh.teasystemapi.entity.RestaurantEntity;
import bnp.cib.fresh.teasystemapi.repository.EventRepository;
import bnp.cib.fresh.teasystemapi.repository.MemberRepository;
import bnp.cib.fresh.teasystemapi.repository.OrderRepository;
import bnp.cib.fresh.teasystemapi.repository.RestaurantRepository;

@Service
public class TeaSystemService {

	@Autowired
	private MemberRepository memberRepository;

	@Autowired
	private EventRepository eventRepository;

	@Autowired
	private RestaurantRepository restaurantRepository;

	@Autowired
	private OrderRepository orderRepository;

	private static Map<Integer, String> restaurantMap = new HashMap<Integer, String>();

	private static final String PARAM_PATTERN = "<script id=\"__NEXT_DATA__\" type=\"application/json\">(.*?)</script></body></html>";

	public List<MemberRespDto> getAllMembers() {
		return memberRepository.findAll().stream()
				.map(x -> MemberRespDto.builder().uid(x.getUid()).name(x.getName()).build()).toList();
	}

	public EventRespDto getEvent(int id) {
		EventEntity event = eventRepository.findById(id).get();
		RestaurantEntity restaurant = restaurantRepository.findById(event.getRestaurantId()).get();
		return EventRespDto.builder().organizer(event.getOrganizer()).date(event.getDate())
				.restaurantName(restaurant.getName()).menuImgUrl(restaurant.getMenuPath()).descp(event.getDescription())
				.isClosed(event.getIsClosed()).build();
	}

	public List<OrderDto> getOrderyByEvent(int id) {
		return orderRepository.findByEventId(id).stream()
				.map(x -> OrderDto.builder().user(x.getUser()).id(x.getId()).itemId(x.getItemId())
						.categoryId(x.getCategoryId()).orderDisplay(x.getOrderDisplay()).remark(x.getRemark()).build())
				.toList();
	}

	public OrderDto saveOrder(OrderDto orderDto) {
		if (orderDto.getId() != null) {
			OrderEntity order = orderRepository.findById(orderDto.getId()).get();
			order.setItemId(orderDto.getItemId());
			order.setOrderDisplay(orderDto.getOrderDisplay());
			order.setRemark(orderDto.getRemark());
			order.setCategoryId(orderDto.getCategoryId());
			orderRepository.save(order);
		} else {
			orderRepository.save(OrderEntity.builder().itemId(orderDto.getItemId()).eventId(orderDto.getEventId())
					.orderDisplay(orderDto.getOrderDisplay()).remark(orderDto.getRemark()).user(orderDto.getUser())
					.categoryId(orderDto.getCategoryId()).build());
		}
		return orderDto;
	}

	public OrderDto deleteOrder(OrderDto orderDto) {
		if (orderDto.getId() != null) {
			orderRepository.deleteById(orderDto.getId());
		}
		return orderDto;
	}

	public String getRestaurantMenu(int id, boolean isEng) throws IOException, URISyntaxException {
		if (restaurantMap.get(id) == null) {
			EventEntity event = eventRepository.findById(id).get();
			if (event.getRestaurantId() > 100) {
				RestaurantEntity restaurant = restaurantRepository.findById(event.getRestaurantId()).get();
				String menuSourceUrl = null;
				if (isEng && restaurant.getMenuSourceUrlEn() != null) {
					menuSourceUrl = restaurant.getMenuSourceUrlEn();
				} else {
					menuSourceUrl = restaurant.getMenuSourceUrl();
				}
				InputStream inputStream = this.getClass().getClassLoader()
						.getResourceAsStream(menuSourceUrl);
				return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
			}
			RestaurantEntity restaurant = restaurantRepository.findById(event.getRestaurantId()).get();
			String content = "";
			final CredentialsProvider credsProvider = CredentialsProviderBuilder.create()
					.add(new AuthScope("ncproxy1", 8080), "c55933", "yyyyY@8631969".toCharArray()).build();
			final HttpHost target = new HttpHost("https", "deliveroo.hk", 443);
			final HttpHost proxy = new HttpHost("http", "ncproxy1", 8080);
			try (final CloseableHttpClient httpclient = HttpClients.custom().setProxy(proxy)
					.setDefaultCredentialsProvider(credsProvider).build()) {

				final RequestConfig config = RequestConfig.custom()
						.setTargetPreferredAuthSchemes(Arrays.asList(StandardAuthScheme.BASIC)).build();
				final HttpGet request = new HttpGet(restaurant.getMenuSourceUrl());
				request.setConfig(config);

				System.out
						.println("Executing request " + request.getMethod() + " " + request.getUri() + " via " + proxy);

				content = httpclient.execute(target, request, response -> {
					System.out.println("----------------------------------------");
					System.out.println(request + "->" + new StatusLine(response));
					return EntityUtils.toString(response.getEntity());
				});
			}

			ObjectMapper mapper = new ObjectMapper();

			Matcher m = Pattern.compile(PARAM_PATTERN).matcher(content);

			while (m.find()) {
				String result = m.group(1);

				JsonNode j = mapper.readTree(result);
				restaurantMap.put(id,
						j.get("props").get("initialState").get("menuPage").get("menu").get("meta").toString());
			}
		}
		return restaurantMap.get(id);
	}
}
