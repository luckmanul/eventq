package id.co.company.eventq.service.mapper;

import id.co.company.eventq.domain.Question;
import id.co.company.eventq.service.dto.QuestionDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

/**
 * Mapper for the entity Question and its DTO QuestionDTO.
 */
@Mapper(componentModel = "spring", uses = { EventMapper.class, })
public interface QuestionMapper extends EntityMapper<QuestionDTO, Question> {

    @Override
    @Mappings({ @Mapping(source = "event.id", target = "eventId"), @Mapping(source = "event", target = "event")

    })
    QuestionDTO toDto(Question question);

    @Override
    @Mapping(source = "eventId", target = "event")
    Question toEntity(QuestionDTO questionDTO);

    default Question fromId(final Long id) {
        if (id == null) {
            return null;
        }
        final Question question = new Question();
        question.setId(id);
        return question;
    }
}
