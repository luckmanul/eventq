package id.co.company.eventq.web.websocket.dto;

/**
 * DTO for storing activity when question added.
 *
 * @author Lukmanul Hakim
 */
public class EventQActivity {

    private String sessionId;

    private String userLogin;

    private String ipAddress;

    private String eventCode;

    private int page;

    private int size;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(final String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(final String userLogin) {
        this.userLogin = userLogin;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(final String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getEventCode() {
        return eventCode;
    }

    public void setEventCode(final String eventCode) {
        this.eventCode = eventCode;
    }

    public int getPage() {
        return page;
    }

    public void setPage(final int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(final int size) {
        this.size = size;
    }

    @Override
    public String toString() {
        return "EventQActivity [sessionId=" + sessionId + ", userLogin=" + userLogin + ", ipAddress=" + ipAddress
                + ", eventCode=" + eventCode + ", page=" + page + ", size=" + size + "]";
    }

}
