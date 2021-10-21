package dev.diltheyaislan.app.keycloak.provider.appdb;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Collections;

import org.jboss.logging.Logger;
import org.keycloak.component.ComponentModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.storage.StorageId;
import org.keycloak.storage.adapter.AbstractUserAdapterFederatedStorage;
import org.keycloak.models.RoleModel;
import org.keycloak.models.ClientModel;

import dev.diltheyaislan.app.keycloak.provider.appdb.entity.User;
import dev.diltheyaislan.app.keycloak.provider.appdb.entity.Role;
import dev.diltheyaislan.app.keycloak.provider.appdb.entity.ERole;
import dev.diltheyaislan.app.keycloak.provider.appdb.repository.UserRepository;
import dev.diltheyaislan.app.keycloak.provider.appdb.repository.IUserRepository;

public class AppUserAdapter extends AbstractUserAdapterFederatedStorage {

	private final Logger log = Logger.getLogger(AppUserAdapter.class);

	private final User user;

	private Set<RoleModel> cachedUserRoles;
	private final KeycloakSession session;
	private final RealmModel realm;
	private final ComponentModel model;
    private final String kcId;
	private final IUserRepository userRepository;

	public AppUserAdapter(KeycloakSession session, RealmModel realm, ComponentModel model, User user, IUserRepository userRepository) {
		super(session, realm, model);
		this.user = user;
		this.kcId = StorageId.keycloakId(model, user.getId().toString());
		this.session = session;
		this.model = model;
		this.realm = realm;
		this.userRepository = userRepository;
	}
	
	@Override
	public String getId() {
		// if (storageId == null) {
        //     storageId = new StorageId(storageProviderModel.getId(), user.getId());
        // }
		log.infov("[Keycloak UserModel Adapter] Getting Id {0}....", this.kcId);
        // return storageId.getId();
		return this.kcId;
	}

	@Override
	public String getUsername() {
		log.infov("[Keycloak UserModel Adapter] Getting username {0}....", user.getUsername());
		return user.getUsername();
	}

	@Override
	public void setUsername(String username) {
		user.setUsername(username);
	}

	@Override
	public String getEmail() {
		log.infov("[Keycloak UserModel Adapter] Getting email {0}....",  user.getEmail());
		return user.getEmail();
	}

	@Override
	public void setEmail(String email) {
		log.infov("[Keycloak UserModel Adapter] Setting email: email={0}", email);
		user.setEmail(email);
	}

	@Override
	public String getFirstName() {
		log.infov("[Keycloak UserModel Adapter] Getting firstName ....");
		return user.getFirstName();
	}

	@Override
	public void setFirstName(String firstName) {
		log.infov("[Keycloak UserModel Adapter] Setting firstName: firstName={0}", firstName);
		user.setFirstName(firstName);
	}

	@Override
	public String getLastName() {
		log.infov("[Keycloak UserModel Adapter] Getting lastName ....");
		return user.getLastName();
	}

	@Override
	public void setLastName(String lastName) {
		log.infov("[Keycloak UserModel Adapter] Setting lastName: lastName={0}", lastName);
		user.setLastName(lastName);
	}

	public String getPassword() {
		log.infov("[Keycloak UserModel Adapter] Getting password ....");
		return user.getPassword();
	}

	public void setPassword(String password) {
		log.infov("[Keycloak UserModel Adapter] Setting password: password={0}", password);
		user.setPassword(password);
	}

	@Override
	public void grantRole(RoleModel role) {
		super.grantRole(role);
		userRepository.setRole(user.getUsername(), role.getName());
	}

	@Override
    public Set<RoleModel> getRoleMappings() {
    	log.info("get Client Role Mapping");
    	log.debug("getClientRoleMappings");
		
		List<String> roles = userRepository.getRoles(user.getUsername());

		Set<RoleModel> mroles = new HashSet<RoleModel>();
		for (int i = 0; i < roles.size(); i++) {
			RoleModel role = realm.getRole(roles.get(i));
			mroles.add(role);
		}
		mroles.add(realm.getRole("default-roles-sonatrach"));

		return mroles;
    }

	// @Override
    // public boolean hasRole(RoleModel role) {
    //     List<String> mappings = userRepository.getRoles(user.getUsername());
    //     for (String mapping: mappings) {
    //        if (mapping == role.getName()) return true;
    //     }
    //     return false;
    // }

	// @Override
	// public void deleteRoleMapping(RoleModel role) {
	// 	super.deleteRoleMapping(role);	
		// log.info("delete role");

		// userRepository.deleteRole(user.getUsername(), role.getName());
	// }

	// @Override
    // public void deleteRoleMapping(RoleModel role) {
	// 	super.deleteRoleMapping(role);	
    //     getFederatedStorage().deleteRoleMapping(realm, this.getId(), role);
	// 	userRepository.deleteRole(user.getUsername(), role.getName());

    // }

	// @Override
	// public void setAttribute(String name, List<String> values) {
	// 	log.infov("[Keycloak UserModel Adapter] Setting attribute {0} with values {1}", name, values);

	// 	switch(name){
	// 		case "firstName":
	// 			user.setFirstName(values.get(0));
	// 			break;
	// 		case "lastName":
	// 			user.setLastName(values.get(0));
	// 			break;
	// 		case "email":
	// 			user.setEmail(values.get(0));
	// 			break;
	// 		case "password":
	// 			user.setPassword(values.get(0));
	// 			break;
	// 	}

	// 	if (user.getKeycloakId() == null) {
	// 		user.setKeycloakId(getId());
	// 	}

	// 	AppTransaction transaction = new AppTransaction(UserRepository.getInstance(), user);
	// 	ensureTransactionStarted(transaction);
	// 	getFederatedStorage().setAttribute(realm, this.getId(), name, values);
	// }

	private void ensureTransactionStarted(AppTransaction transaction) {
		if (transaction.getState() == AppTransaction.TransactionState.NOT_STARTED) {
			log.infov("Enlisting user repository transaction ...");
			session.getTransactionManager().enlistAfterCompletion(transaction);
		}
	}
}
