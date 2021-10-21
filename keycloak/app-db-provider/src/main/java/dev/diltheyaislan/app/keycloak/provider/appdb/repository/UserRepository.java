package dev.diltheyaislan.app.keycloak.provider.appdb.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.jboss.logging.Logger;

import dev.diltheyaislan.app.infrastructure.database.DbConnection;
import dev.diltheyaislan.app.keycloak.provider.appdb.entity.User;

public class UserRepository implements IUserRepository {

	private final Logger log = Logger.getLogger(UserRepository.class);

	private final String SQL_SELECT_BY_ID = "SELECT app.user_account.id, keycloak_id, username, password, email, last_name, first_name FROM app_private.user_account INNER JOIN app.user_account ON app_private.user_account.id = app.user_account.id AND CAST(app_private.user_account.id AS text)=?";
	private final String SQL_SELECT_BY_USERNAME = "SELECT app.user_account.id, keycloak_id, username, password, email, last_name, first_name FROM app_private.user_account INNER JOIN app.user_account ON app_private.user_account.id = app.user_account.id AND app_private.user_account.username = ? OR CAST(app_private.user_account.id AS text)=?";
	private final String SQL_SELECT_BY_EMAIL = "SELECT app.user_account.id, keycloak_id, username, password, email, last_name, first_name FROM app_private.user_account INNER JOIN app.user_account ON app_private.user_account.id = app.user_account.id AND app_private.user_account.email = ? OR CAST(app_private.user_account.id AS text)=?";
	private final String SQL_INSERT = "WITH ins_pvt_acc AS (INSERT INTO app_private.user_account (keycloak_id, username, password) VALUES (?, ?, ?) RETURNING id) " 
	+ "INSERT INTO app.user_account(id, email, last_name, first_name) "
	+ "VALUES ((SELECT id FROM ins_pvt_acc), ?, ?, ?) RETURNING id";
	private final String SQL_UPDATE = "WITH upd_pvt_acc AS (UPDATE app_private.user_account SET keycloak_id=?, password=? WHERE app_private.user_account.username = ? RETURNING id) UPDATE app.user_account set last_name=?, first_name=?, email=? password WHERE id = (SELECT id FROM upd_pvt_acc)";
	private final String SQL_SET_PASSWORD = "UPDATE app_private.user_account SET password = ? WHERE username = ?";
	private final String SQL_DELETE = "DELETE FROM app_private.user_account WHERE username=?";
	private final String SQL_COUNT = "SELECT COUNT(*) AS count FROM app_private.user_account";
	private final String SQL_SELECT_ALL = "SELECT app.user_account.id, keycloak_id, username, password, email, last_name, first_name FROM app_private.user_account INNER JOIN app.user_account ON app_private.user_account.id = app.user_account.id";
	private final String SQL_SET_ROLE = "INSERT INTO app.user_roles (user_id, role_id) VALUES ((SELECT id FROM app_private.user_account WHERE username = ?), (SELECT id FROM app.role WHERE code = ?))";
	private final String SQL_GET_ROLES = "SELECT code FROM app_private.user_account INNER JOIN app.user_account ON app.user_account.id = app_private.user_account.id AND username = ? INNER JOIN app.user_roles ON app.user_account.id = app.user_roles.user_id INNER JOIN app.role ON app.user_roles.role_id = app.role.id";
	private final String SQL_DELETE_ROLE = "DELETE FROM app.user_roles WHERE app.user_roles.user_id = (SELECT id FROM app_private.user_account WHERE username = ?) AND app.user_roles.role_id = (SELECT id FROM app.role WHERE code = ?)";

	private DbConnection db = new DbConnection();

	private static UserRepository instance;

	private UserRepository() {

	}

	public static UserRepository getInstance() {
		if (instance == null) {
			instance = new UserRepository();
		}
		return instance;
	}
 
	@Override
	public String insert(User user) {
		
		if (getByUsername(user.getUsername()) != null) {
			return null;
		} 

		String insertedId = null;

		try {
			db.connect();
			db.createPreparedStatement(SQL_INSERT);
			db.getPreparedStatement().setString(1, user.getKeycloakId());
			db.getPreparedStatement().setString(2, user.getUsername());
			db.getPreparedStatement().setString(3, user.getPassword());
			db.getPreparedStatement().setString(4, user.getEmail());
			db.getPreparedStatement().setString(5, user.getLastName());
			db.getPreparedStatement().setString(6, user.getFirstName());
			// db.getPreparedStatement().setString(7, user.getRole());

			db.getPreparedStatement().executeUpdate();
			
			ResultSet rs = db.getPreparedStatement().getGeneratedKeys();
			if (rs.next()) {
				insertedId = rs.getString(1);
			}

			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}

		return insertedId;
	}

	@Override
	public User getById(String id) {
		User user = null;
		try {
			db.connect();
			db.createPreparedStatement(SQL_SELECT_BY_ID);

			db.getPreparedStatement().setString(1, id);

			ResultSet rs = db.getPreparedStatement().executeQuery();

			if  (rs.next()) {
				user = new User();
				user.setId(rs.getString("id"));
				user.setFirstName(rs.getString("first_name"));
				user.setLastName(rs.getString("last_name"));
				user.setEmail(rs.getString("email"));
				user.setUsername(rs.getString("username"));
				user.setKeycloakId(rs.getString("keycloak_id"));
				user.setPassword(rs.getString("password"));
				// user.setRole(rs.getString("role"));
			}

			rs.close();
			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
		return user;
	}

	@Override
	public User getByUsername(String username) {
		User user = null;
		try {
			db.connect();
			db.createPreparedStatement(SQL_SELECT_BY_USERNAME);

			db.getPreparedStatement().setString(1, username);
			db.getPreparedStatement().setString(2, username);

			ResultSet rs = db.getPreparedStatement().executeQuery();

			if  (rs.next()) {
				user = new User();
				user.setId(rs.getString("id"));
				user.setFirstName(rs.getString("first_name"));
				user.setLastName(rs.getString("last_name"));
				user.setEmail(rs.getString("email"));
				user.setUsername(rs.getString("username"));
				user.setKeycloakId(rs.getString("keycloak_id"));
				user.setPassword(rs.getString("password"));
				// user.setRole(rs.getString("role"));
			}

			rs.close();
			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
		return user;
	}

	@Override
	public User getByEmail(String username) {
		User user = null;
		try {
			db.connect();
			db.createPreparedStatement(SQL_SELECT_BY_EMAIL);

			db.getPreparedStatement().setString(1, username);
			db.getPreparedStatement().setString(2, username);

			ResultSet rs = db.getPreparedStatement().executeQuery();

			if  (rs.next()) {
				user = new User();
				user.setId(rs.getString("id"));
				user.setFirstName(rs.getString("first_name"));
				user.setLastName(rs.getString("last_name"));
				user.setEmail(rs.getString("email"));
				user.setUsername(rs.getString("username"));
				user.setKeycloakId(rs.getString("keycloak_id"));
				user.setPassword(rs.getString("password"));
				// user.setRole(rs.getString("role"));
			}

			rs.close();
			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
		return user;
	}

	@Override
	public void update(User user) {
		try {
			db.connect();
			db.createPreparedStatement(SQL_UPDATE);

			db.getPreparedStatement().setString(1, user.getKeycloakId());
			db.getPreparedStatement().setString(2, user.getPassword());
			db.getPreparedStatement().setString(3, user.getUsername());
			db.getPreparedStatement().setString(4, user.getLastName());
			db.getPreparedStatement().setString(5, user.getFirstName());
			db.getPreparedStatement().setString(6, user.getEmail());
			// db.getPreparedStatement().setString(7, user.getRole());
			

			db.getPreparedStatement().executeUpdate();
			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void updatePassword(String password, String username) {
		try {
			db.connect();
			db.createPreparedStatement(SQL_SET_PASSWORD);

			db.getPreparedStatement().setString(1, password);
			db.getPreparedStatement().setString(2, username);

			db.getPreparedStatement().executeUpdate();
			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void setRole(String username, String roleCode) {
		try {
			db.connect();
			db.createPreparedStatement(SQL_SET_ROLE);

			db.getPreparedStatement().setString(1, username);
			db.getPreparedStatement().setString(2, roleCode);

			db.getPreparedStatement().executeUpdate();
			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void deleteRole(String username, String roleCode) {
		try {
			db.connect();
			db.createPreparedStatement(SQL_DELETE_ROLE);

			db.getPreparedStatement().setString(1, username);
			db.getPreparedStatement().setString(2, roleCode);

			db.getPreparedStatement().executeUpdate();
			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
	}

	@Override
	public List<String> getRoles(String username) {
		List<String> roles = new ArrayList<>();
		try {
			db.connect();
			db.createPreparedStatement(SQL_GET_ROLES);

			db.getPreparedStatement().setString(1, username);

			ResultSet rs = db.getPreparedStatement().executeQuery();

			while (rs.next()) {
				roles.add(rs.getString("code"));
			}

			rs.close();
			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
		return roles;
	}

	@Override
	public void remove(String username) {
		try {
			db.connect();
			db.createPreparedStatement(SQL_DELETE);

			db.getPreparedStatement().setString(1, username);

			db.getPreparedStatement().executeUpdate();
			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
	}

	@Override
	public int count() {
		int count = 0;
		try {
			db.connect();
			db.createPreparedStatement(SQL_COUNT);

			ResultSet rs = db.getPreparedStatement().executeQuery();

			if  (rs.next()) {
				count = rs.getInt("count");
			}

			rs.close();
			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
		return count;
	}

	@Override
	public List<User> getAll() {
		List<User> users = new ArrayList<>();
		try {
			db.connect();
			db.createPreparedStatement(SQL_SELECT_ALL);
			ResultSet rs = db.getPreparedStatement().executeQuery();

			log.infov("USERRR" + rs.toString());

			while (rs.next()) {
				User user = new User();
				user.setId(rs.getString("id"));
				user.setFirstName(rs.getString("first_name"));
				user.setLastName(rs.getString("last_name"));
				user.setEmail(rs.getString("email"));
				user.setUsername(rs.getString("username"));
				user.setKeycloakId(rs.getString("keycloak_id"));
				user.setPassword(rs.getString("password"));
				// user.setRole(rs.getString("role"));
				users.add(user);
			}

			rs.close();
			db.disconnect();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
		return users;
	}
}
