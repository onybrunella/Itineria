package com.itineria.backend.dto;

public class UserInfo {

    private Long id;
    private String pseudo;

    public UserInfo(Long id, String pseudo) {
        this.id = id;
        this.pseudo = pseudo;
    }

    public Long getId() {
        return id;
    }

    public String getPseudo() {
        return pseudo;
    }
}
