package id.co.company.eventq.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the Question entity.
 */
public class QuestionDTO implements Serializable {

    private Long id;

    private String title;

    private String description;

    private String feedback;

    private long likes;

    private boolean publish;

    private ZonedDateTime createDate;

    private Long eventId;

    private EventDTO event;

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(final String feedback) {
        this.feedback = feedback;
    }

    public long getLikes() {
        return likes;
    }

    public void setLikes(final long likes) {
        this.likes = likes;
    }

    public boolean isPublish() {
        return publish;
    }

    public void setPublish(final boolean publish) {
        this.publish = publish;
    }

    public ZonedDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(final ZonedDateTime createDate) {
        this.createDate = createDate;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(final Long eventId) {
        this.eventId = eventId;
    }

    public EventDTO getEvent() {
        return event;
    }

    public void setEvent(final EventDTO event) {
        this.event = event;
    }

    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || this.getClass() != o.getClass()) {
            return false;
        }

        final QuestionDTO questionDTO = (QuestionDTO) o;
        if (questionDTO.getId() == null || this.getId() == null) {
            return false;
        }
        return Objects.equals(this.getId(), questionDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(this.getId());
    }

    @Override
    public String toString() {
        return "QuestionDTO{" + "id=" + this.getId() + ", title='" + this.getTitle() + "'" + ", description='"
                + this.getDescription() + "'" + ", feedback='" + this.getFeedback() + "'" + ", createDate='"
                + this.getCreateDate() + "'" + "}";
    }
}
