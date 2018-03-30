package id.co.company.eventq.web.websocket;

import static id.co.company.eventq.config.WebsocketConfiguration.IP_ADDRESS;

import id.co.company.eventq.service.EventService;
import id.co.company.eventq.service.QuestionService;
import id.co.company.eventq.service.dto.EventDTO;
import id.co.company.eventq.service.dto.QuestionDTO;
import id.co.company.eventq.web.websocket.dto.ActivityDTO;
import id.co.company.eventq.web.websocket.dto.EventQActivity;

import java.security.Principal;
import java.time.Instant;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
public class ActivityService implements ApplicationListener<SessionDisconnectEvent> {

    private static final Logger log = LoggerFactory.getLogger(ActivityService.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    // public ActivityService(SimpMessageSendingOperations messagingTemplate) {
    // this.messagingTemplate = messagingTemplate;
    // }

    @Autowired
    private QuestionService questionService;

    @Autowired
    private EventService eventService;

    @SubscribeMapping("/topic/activity")
    @SendTo("/topic/tracker")
    public ActivityDTO sendActivity(@Payload final ActivityDTO activityDTO,
            final StompHeaderAccessor stompHeaderAccessor, final Principal principal) {
        activityDTO.setUserLogin(principal.getName());
        activityDTO.setSessionId(stompHeaderAccessor.getSessionId());
        activityDTO.setIpAddress(stompHeaderAccessor.getSessionAttributes().get(IP_ADDRESS).toString());
        activityDTO.setTime(Instant.now());
        log.debug("Sending user tracking data {}", activityDTO);
        return activityDTO;
    }

    @SubscribeMapping("/topic/eventq-activity")
    @SendTo("/topic/eventq-subscriber")
    public Page<QuestionDTO> sendQActivity(@Payload final EventQActivity activity,
            final StompHeaderAccessor stompHeaderAccessor, final Principal principal) {
        activity.setUserLogin(principal.getName());
        activity.setSessionId(stompHeaderAccessor.getSessionId());
        activity.setIpAddress(stompHeaderAccessor.getSessionAttributes().get(IP_ADDRESS).toString());

        log.debug("Receive message from ws {}", activity);

        Page<QuestionDTO> result = new PageImpl<>(new ArrayList<>());
        final EventDTO event = eventService.findByCode(activity.getEventCode());
        if (event != null) {
            result = questionService.findByEvent(event.getId(),
                    new PageRequest(activity.getPage(), activity.getSize()));
        }
        log.debug("Sending user tracking data {}", result);
        return result;
    }

    @Override
    public void onApplicationEvent(final SessionDisconnectEvent event) {
        final ActivityDTO activityDTO = new ActivityDTO();
        activityDTO.setSessionId(event.getSessionId());
        activityDTO.setPage("logout");
        messagingTemplate.convertAndSend("/topic/tracker", activityDTO);
    }
}
