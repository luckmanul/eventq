package id.co.company.eventq.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * A Question.
 */
@Entity
@Table(name = "question")
public class Question implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "feedback")
    private String feedback;

    @Column(name = "likes")
    private long likes;

    @Column(name = "create_date")
    private ZonedDateTime createDate;

    @Column(name = "publish", nullable = false)
    private Boolean publish = Boolean.FALSE;

    @ManyToOne
    private Event event;

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Question title(final String title) {
        this.title = title;
        return this;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public Question description(final String description) {
        this.description = description;
        return this;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public String getFeedback() {
        return feedback;
    }

    public Question feedback(final String feedback) {
        this.feedback = feedback;
        return this;
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

    public Boolean getPublish() {
        return publish;
    }

    public ZonedDateTime getCreateDate() {
        return createDate;
    }

    public Question createDate(final ZonedDateTime createDate) {
        this.createDate = createDate;
        return this;
    }

    public void setCreateDate(final ZonedDateTime createDate) {
        this.createDate = createDate;
    }

    public Boolean isPublish() {
        return publish;
    }

    public Question publish(final Boolean publish) {
        this.publish = publish;
        return this;
    }

    public void setPublish(final Boolean publish) {
        this.publish = publish;
    }

    public Event getEvent() {
        return event;
    }

    public Question event(final Event event) {
        this.event = event;
        return this;
    }

    public void setEvent(final Event event) {
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
        final Question question = (Question) o;
        if (question.getId() == null || this.getId() == null) {
            return false;
        }
        return Objects.equals(this.getId(), question.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(this.getId());
    }

    @Override
    public String toString() {
        return "Question{" + "id=" + this.getId() + ", title='" + this.getTitle() + "'" + ", description='"
                + this.getDescription() + "'" + ", feedback='" + this.getFeedback() + "'" + ", createDate='"
                + this.getCreateDate() + "'" + ", publish='" + this.isPublish() + "'" + "}";
    }
}
