package id.co.company.eventq.repository;

import id.co.company.eventq.domain.Question;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Question entity.
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    Page<Question> findByEventId(Long eventId, Pageable pageable);

    Page<Question> findByPublish(boolean publish, Pageable pageable);

    Page<Question> findByEventIdAndPublishIsTrueOrderByLikesDesc(Long eventId, Pageable pageable);
}
