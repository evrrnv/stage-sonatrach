package dev.diltheyaislan.app.keycloak.provider.appdb.repository;

import java.util.List;

import dev.diltheyaislan.app.keycloak.provider.appdb.entity.User;

public interface IUserRepository {

	String insert(User user);
    User getByUsername(String username);
    User getByEmail(String email);
    User getById(String id);
    void update(User user);
    void updatePassword(String password, String username);
    void setRole(String username, String roleCode);
    void deleteRole(String username, String roleCode);
    List<String> getRoles(String username);
    void remove(String username);
	int count();
	List<User> getAll();
}
