package id.co.company.eventq.service;

import id.co.company.eventq.domain.Event;
import id.co.company.eventq.repository.EventRepository;
import id.co.company.eventq.service.dto.EventDTO;
import id.co.company.eventq.service.mapper.EventMapper;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing Event.
 */
@Service
@Transactional
public class EventService {

    private final Logger log = LoggerFactory.getLogger(EventService.class);

    private final EventRepository eventRepository;

    private final EventMapper eventMapper;

    public EventService(final EventRepository eventRepository, final EventMapper eventMapper) {
        this.eventRepository = eventRepository;
        this.eventMapper = eventMapper;
    }

    /**
     * Save a event.
     *
     * @param eventDTO
     *            the entity to save
     * @return the persisted entity
     */
    public EventDTO save(final EventDTO eventDTO) {
        log.debug("Request to save Event : {}", eventDTO);
        Event event = eventMapper.toEntity(eventDTO);
        event = eventRepository.save(event);
        return eventMapper.toDto(event);
    }

    /**
     * Get all the events.
     *
     * @param pageable
     *            the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<EventDTO> findAll(final Pageable pageable) {
        log.debug("Request to get all Events");
        return eventRepository.findAll(pageable).map(eventMapper::toDto);
    }

    /**
     * Get one event by id.
     *
     * @param id
     *            the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public EventDTO findOne(final Long id) {
        log.debug("Request to get Event : {}", id);
        final Event event = eventRepository.findOne(id);
        return eventMapper.toDto(event);
    }

    @Transactional(readOnly = true)
    public EventDTO findByCode(final String code) {
        log.debug("Request to get Event : {}", code);
        final Optional<Event> event = eventRepository.findByCode(code);
        return event.isPresent() ? eventMapper.toDto(event.get()) : null;
    }

    /**
     * Delete the event by id.
     *
     * @param id
     *            the id of the entity
     */
    public void delete(final Long id) {
        log.debug("Request to delete Event : {}", id);
        eventRepository.delete(id);
    }
}
