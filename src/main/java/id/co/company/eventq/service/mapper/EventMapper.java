package id.co.company.eventq.service.mapper;

import id.co.company.eventq.domain.*;
import id.co.company.eventq.service.dto.EventDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Event and its DTO EventDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EventMapper extends EntityMapper <EventDTO, Event> {
    
    @Mapping(target = "questions", ignore = true)
    Event toEntity(EventDTO eventDTO); 
    default Event fromId(Long id) {
        if (id == null) {
            return null;
        }
        Event event = new Event();
        event.setId(id);
        return event;
    }
}
