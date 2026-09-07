package com.itineria.backend.dto;

public class RegisterResponse {

    private Long id;
    private String email;
    private String pseudo;
    
    public RegisterResponse(Long id, String email, String pseudo){
        this.id=id;
        this.email=email;
        this.pseudo=pseudo;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPseudo() {
        return pseudo;
    }
}
