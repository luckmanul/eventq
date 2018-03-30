package id.co.company.eventq.web.rest;

import id.co.company.eventq.service.EventService;
import id.co.company.eventq.service.dto.EventDTO;
import id.co.company.eventq.web.rest.util.HeaderUtil;
import id.co.company.eventq.web.rest.util.PaginationUtil;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing Event.
 */
@RestController
@RequestMapping("/api")
public class EventResource {

    private final Logger log = LoggerFactory.getLogger(EventResource.class);

    private static final String ENTITY_NAME = "event";

    private final EventService eventService;

    public EventResource(final EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * POST /events : Create a new event.
     *
     * @param eventDTO
     *            the eventDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new eventDTO, or with status 400 (Bad
     *         Request) if the event has already an ID
     * @throws URISyntaxException
     *             if the Location URI syntax is incorrect
     */
    @PostMapping("/events")
    @Timed
    public ResponseEntity<EventDTO> createEvent(@RequestBody final EventDTO eventDTO) throws URISyntaxException {
        log.debug("REST request to save Event : {}", eventDTO);
        if (eventDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(
                    HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new event cannot already have an ID"))
                    .body(null);
        }
        final EventDTO result = eventService.save(eventDTO);
        return ResponseEntity.created(new URI("/api/events/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * PUT /events : Updates an existing event.
     *
     * @param eventDTO
     *            the eventDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated eventDTO,
     *         or with status 400 (Bad Request) if the eventDTO is not valid,
     *         or with status 500 (Internal Server Error) if the eventDTO couldn't be updated
     * @throws URISyntaxException
     *             if the Location URI syntax is incorrect
     */
    @PutMapping("/events")
    @Timed
    public ResponseEntity<EventDTO> updateEvent(@RequestBody final EventDTO eventDTO) throws URISyntaxException {
        log.debug("REST request to update Event : {}", eventDTO);
        if (eventDTO.getId() == null) {
            return this.createEvent(eventDTO);
        }
        final EventDTO result = eventService.save(eventDTO);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, eventDTO.getId().toString()))
                .body(result);
    }

    /**
     * GET /events : get all the events.
     *
     * @param pageable
     *            the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of events in body
     */
    @GetMapping("/events")
    @Timed
    public ResponseEntity<List<EventDTO>> getAllEvents(@ApiParam final Pageable pageable) {
        log.debug("REST request to get a page of Events");
        final Page<EventDTO> page = eventService.findAll(pageable);
        final HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/events");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET /events/:id : get the "id" event.
     *
     * @param id
     *            the id of the eventDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the eventDTO, or with status 404 (Not Found)
     */
    @GetMapping("/events/{id}")
    @Timed
    public ResponseEntity<EventDTO> getEvent(@PathVariable final Long id) {
        log.debug("REST request to get Event : {}", id);
        final EventDTO eventDTO = eventService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventDTO));
    }

    @GetMapping("/events/bycode/{code}")
    @Timed
    public ResponseEntity<EventDTO> getEventByCode(@PathVariable final String code) {
        log.debug("REST request to get Event : {}", code);
        final EventDTO eventDTO = eventService.findByCode(code);
        try {
            Thread.sleep(2000);
        } catch (final InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventDTO));
    }

    /**
     * DELETE /events/:id : delete the "id" event.
     *
     * @param id
     *            the id of the eventDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/events/{id}")
    @Timed
    public ResponseEntity<Void> deleteEvent(@PathVariable final Long id) {
        log.debug("REST request to delete Event : {}", id);
        eventService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
