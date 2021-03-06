package id.co.company.eventq.config;

import id.co.company.eventq.security.AuthoritiesConstants;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import io.github.jhipster.config.JHipsterProperties;

@Configuration
@EnableWebSocketMessageBroker
public class WebsocketConfiguration extends AbstractWebSocketMessageBrokerConfigurer {

    private final Logger log = LoggerFactory.getLogger(WebsocketConfiguration.class);

    public static final String IP_ADDRESS = "IP_ADDRESS";

    private final JHipsterProperties jHipsterProperties;

    public WebsocketConfiguration(final JHipsterProperties jHipsterProperties) {
        this.jHipsterProperties = jHipsterProperties;
    }

    @Override
    public void configureMessageBroker(final MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
    }

    @Override
    public void registerStompEndpoints(final StompEndpointRegistry registry) {
        final String[] allowedOrigins = Optional.ofNullable(jHipsterProperties.getCors().getAllowedOrigins())
                .map(origins -> origins.toArray(new String[0])).orElse(new String[0]);
        registry.addEndpoint("/websocket/tracker").setHandshakeHandler(new DefaultHandshakeHandler() {
            @Override
            protected Principal determineUser(final ServerHttpRequest request, final WebSocketHandler wsHandler,
                    final Map<String, Object> attributes) {
                Principal principal = request.getPrincipal();
                if (principal == null) {
                    final Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    authorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.ANONYMOUS));
                    principal = new AnonymousAuthenticationToken("WebsocketConfiguration", "anonymous", authorities);
                }
                return principal;
            }
        }).setAllowedOrigins(allowedOrigins).withSockJS().setInterceptors(this.httpSessionHandshakeInterceptor());
    }

    @Bean
    public HandshakeInterceptor httpSessionHandshakeInterceptor() {
        return new HandshakeInterceptor() {

            @Override
            public boolean beforeHandshake(final ServerHttpRequest request, final ServerHttpResponse response,
                    final WebSocketHandler wsHandler, final Map<String, Object> attributes) throws Exception {
                if (request instanceof ServletServerHttpRequest) {
                    final ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
                    attributes.put(IP_ADDRESS, servletRequest.getRemoteAddress());
                }
                return true;
            }

            @Override
            public void afterHandshake(final ServerHttpRequest request, final ServerHttpResponse response,
                    final WebSocketHandler wsHandler, final Exception exception) {

            }
        };
    }
}
