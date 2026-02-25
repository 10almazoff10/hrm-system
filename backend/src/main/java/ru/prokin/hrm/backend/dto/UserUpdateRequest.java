package ru.prokin.hrm.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class UserUpdateRequest {
    // Username is not included as it should not be changeable
    private String password;
    
    @NotBlank
    private String firstName;
    
    @NotBlank
    private String lastName;
    
    // Position field
    private Long positionId;

    private Long companyId;

    // Constructors
    public UserUpdateRequest() {}
    
    public UserUpdateRequest(String password, String firstName, String lastName) {
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and setters
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }
}