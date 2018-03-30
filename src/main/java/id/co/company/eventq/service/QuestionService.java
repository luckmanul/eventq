package id.co.company.eventq.service;

import id.co.company.eventq.domain.Question;
import id.co.company.eventq.repository.QuestionRepository;
import id.co.company.eventq.service.dto.QuestionDTO;
import id.co.company.eventq.service.mapper.QuestionMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing Question.
 */
@Service
@Transactional
public class QuestionService {

    private final Logger log = LoggerFactory.getLogger(QuestionService.class);

    private final QuestionRepository questionRepository;

    private final QuestionMapper questionMapper;

    public QuestionService(final QuestionRepository questionRepository, final QuestionMapper questionMapper) {
        this.questionRepository = questionRepository;
        this.questionMapper = questionMapper;
    }

    /**
     * Save a question.
     *
     * @param questionDTO
     *            the entity to save
     * @return the persisted entity
     */
    public QuestionDTO save(final QuestionDTO questionDTO) {
        log.debug("Request to save Question : {}", questionDTO);
        Question question = questionMapper.toEntity(questionDTO);
        question = questionRepository.save(question);
        return questionMapper.toDto(question);
    }

    /**
     * Get all the questions.
     *
     * @param pageable
     *            the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionDTO> findAll(final Pageable pageable) {
        log.debug("Request to get all Questions");
        return questionRepository.findAll(pageable).map(questionMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<QuestionDTO> findByEvent(final Long eventId, final Pageable pageable) {
        log.debug("Request to get all Questions");
        return questionRepository.findByEventId(eventId, pageable).map(questionMapper::toDto);
    }

    /**
     * Get one question by id.
     *
     * @param id
     *            the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public QuestionDTO findOne(final Long id) {
        log.debug("Request to get Question : {}", id);
        final Question question = questionRepository.findOne(id);
        return questionMapper.toDto(question);
    }

    /**
     * Delete the question by id.
     *
     * @param id
     *            the id of the entity
     */
    public void delete(final Long id) {
        log.debug("Request to delete Question : {}", id);
        questionRepository.delete(id);
    }
}
