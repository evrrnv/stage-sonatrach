package dev.diltheyaislan.app.keycloak.provider.appdb.entity;

import java.sql.Date;
import java.util.List;

public class User {
	private String id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
	private String keycloakId;
	private List<String> roles;
	public User() {
	}

    public User(String id, String firstName, String lastName, String email, String keycloakId, String username, String passowrd, List<String> roles) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
		this.keycloakId = keycloakId;
        this.password = passowrd;
		this.roles = roles;
    }

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles (List<String> roles) {
		this.roles = roles;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		if (username != null) {
			this.username = username;
		}
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		if (firstName != null) {
			this.firstName = firstName;
		}
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		if (lastName != null) {
			this.lastName = lastName;
		}
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		if (email != null) {
			this.email = email;
		}
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
        this.password = password;
    }

	public String getKeycloakId() {
		return keycloakId;
	}

	public void setKeycloakId(String keycloakId) {
		this.keycloakId = keycloakId;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", email=" + email + ", prenom=" + firstName + ", nom=" + lastName
				+ ", password=" + password + ", username=" + username + ", keycloakId=" + keycloakId;
	}
}