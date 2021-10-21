package dev.diltheyaislan.app.keycloak.provider.appdb;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.jboss.logging.Logger;
import org.keycloak.component.ComponentModel;
import org.keycloak.credential.CredentialInput;
import org.keycloak.credential.CredentialInputValidator;
import org.keycloak.models.GroupModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.RoleMapperModel;
import org.keycloak.models.RoleModel;
import org.keycloak.models.RoleProvider;
import org.keycloak.models.RoleProviderFactory;
import org.keycloak.models.UserCredentialModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.UserProvider;
import org.keycloak.storage.StorageId;
import org.keycloak.storage.UserStorageProvider;
import org.keycloak.storage.federated.UserRoleMappingsFederatedStorage;
import org.keycloak.storage.group.GroupLookupProvider;
import org.keycloak.storage.role.RoleLookupProvider;
import org.keycloak.storage.user.UserLookupProvider;
import org.keycloak.storage.user.UserQueryProvider;
import org.keycloak.storage.user.UserRegistrationProvider;
import org.keycloak.credential.CredentialInputUpdater;
import org.keycloak.models.cache.CachedUserModel;
import java.util.*;

import dev.diltheyaislan.app.keycloak.provider.appdb.entity.Role;
import dev.diltheyaislan.app.keycloak.provider.appdb.entity.User;
import dev.diltheyaislan.app.keycloak.provider.appdb.repository.IUserRepository;

public class AppUserStorageProvider implements
	UserStorageProvider,
	UserLookupProvider,
	CredentialInputValidator,
	UserQueryProvider,
	UserRegistrationProvider,
	CredentialInputUpdater {

		private final Logger log = Logger.getLogger(AppUserStorageProvider.class);
		public static final String PASSWORD_CACHE_KEY = AppUserAdapter.class.getName() + ".password";

		private final KeycloakSession session;
		private final ComponentModel model;
		private final IUserRepository userRepository;
		private final Map<String, UserModel> loadedUsers;

		public AppUserStorageProvider(KeycloakSession session, ComponentModel model, IUserRepository userRepository) {
			this.session = session;
			this.model = model;
			this.userRepository = userRepository;
			this.loadedUsers = new HashMap<>();
		}

		@Override
		public void close() {
			log.infov("End of transaction");
		}

		@Override
		public UserModel addUser(RealmModel realm, String username) {
			log.infov("Adding new user to repository: username={0}", username);
			
			User user = new User();
			user.setUsername(username);
			// user.setRole(Role.ETUDIANT);
			
			String insertedId = userRepository.insert(user);

			user.setId(insertedId);

			UserModel userModel = new AppUserAdapter(session, realm, model, user, userRepository);
			log.infov("Finished add new user to repository: username={0}", username);

			return userModel;
		}

		@Override
		public boolean removeUser(RealmModel realm, UserModel user) {
			log.infov("Removing user: user={0}", user.getUsername());
			try {
				userRepository.remove(user.getUsername());
				return true;
			} catch (Exception e) {
				e.printStackTrace();
				return false;
			}
		}


		@Override
		public int getUsersCount(RealmModel realm) {
			return userRepository.count();
		}

		@Override
		public List<UserModel> getUsers(RealmModel realm) {
			List<UserModel> userModelList = new LinkedList<>();
			for (User user : userRepository.getAll()) {
				UserModel userModel = getUserByUsername(user.getUsername(), realm);
				userModelList.add(userModel);
			}
			return userModelList;
		}

		@Override
		public List<UserModel> getUsers(RealmModel realm, int firstResult, int maxResults) {
			List<UserModel> userModelList = new LinkedList<>();
			int i = 0;
			for (User user : userRepository.getAll()) {
				if (i++ < firstResult) continue;
				UserModel userModel = getUserByUsername(user.getUsername(), realm);
				userModelList.add(userModel);
				if (userModelList.size() >= maxResults) break;
			}
			return userModelList;
		}

		@Override
		public List<UserModel> searchForUser(String search, RealmModel realm) {
			return getUsers(realm);
		}

		@Override
		public List<UserModel> searchForUser(String search, RealmModel realm, int firstResult, int maxResults) {
			return getUsers(realm);
		}

		@Override
		public List<UserModel> searchForUser(Map<String, String> params, RealmModel realm) {
			return getUsers(realm);
		}

		@Override
		public List<UserModel> searchForUser(Map<String, String> params, RealmModel realm, int firstResult,
				int maxResults) {
			return getUsers(realm);
		}


		@Override
		public List<UserModel> getGroupMembers(RealmModel realm, GroupModel group) {
			return Collections.EMPTY_LIST;
		}

		@Override
		public List<UserModel> getGroupMembers(RealmModel realm, GroupModel group, int firstResult, int maxResults) {
			return Collections.EMPTY_LIST;
		}

		@Override
		public List<UserModel> searchForUserByUserAttribute(String attrName, String attrValue, RealmModel realm) {
			return Collections.EMPTY_LIST;
		}

		@Override
		public boolean supportsCredentialType(String credentialType) {
			return credentialType.equals("password");
		}

		@Override
		public boolean isConfiguredFor(RealmModel realm, UserModel user, String credentialType) {
			String password = userRepository.getByUsername(user.getUsername()).getPassword();
			log.infov("Checking authentication setup ...");
			return credentialType.equals("password") && password != null;
		}

		@Override
		public boolean updateCredential(RealmModel realm, UserModel userModel, CredentialInput credentialInput) {
			if (!supportsCredentialType(credentialInput.getType()) || !(credentialInput instanceof UserCredentialModel)) return false;
			UserCredentialModel cred = (UserCredentialModel) credentialInput;
			userRepository.updatePassword(cred.getValue(), userModel.getUsername());
	
			return true;
		}

		@Override
		public void disableCredentialType(RealmModel realm, UserModel user, String credentialType) {
			log.info("disableCredentialType");
		}
	
		@Override
		public Set<String> getDisableableCredentialTypes(RealmModel realm, UserModel user) {
			log.info("getDisableableCredentialTypes");
			return Collections.emptySet();
		}

		@Override
		public boolean isValid(RealmModel realm, UserModel user, CredentialInput input) {
			if (!supportsCredentialType(input.getType()) || !(input instanceof UserCredentialModel)) return false;

			UserCredentialModel cred = (UserCredentialModel) input;
			User userEntity = userRepository.getByUsername(user.getUsername());
			String password = userEntity.getPassword();

			if (password == null) return false;

			if (password.equals(cred.getValue())) {
				// RoleModel defaultRole = realm.getRole("default-roles-1sc_project");
				// RoleModel role = realm.getRole(userEntity.getRole());
				// if (defaultRole != null && !user.hasRole(defaultRole)) {
				// 	user.grantRole(defaultRole);
				// }
				// if (role != null && !user.hasRole(role)) {
				// 	user.grantRole(role);
				// }
				return true;
			}

			return false;
		}

		// @Override
		// public UserModel getUserById(String id, RealmModel realm) {
		// 	log.infov("Looking up user via: id={0} realm={1}", id, realm.getId());
		// 	StorageId storageId = new StorageId(id);
		// 	String externalId = storageId.getExternalId(); // user id format - "f:" + component id + ":" + username
		// 	return getUserByUsername(externalId, realm);
		// }

		@Override
		public UserModel getUserById(String id, RealmModel realm) {
			log.infov("Looking up user via: id={0} realm={1}", id, realm.getId());
			StorageId storageId = new StorageId(id);
			String externalId = storageId.getExternalId();
			
			UserModel adapter = loadedUsers.get(externalId);
			if (adapter == null) {
				session.userFederatedStorage().getStoredUsersStream(realm, 0, Integer.MAX_VALUE).forEach(user -> {
					log.infov("User in federated storage: {0}", user);
					log.infov("Attributes: {0}", session.userFederatedStorage().getAttributes(realm, user));
				});
				User user = userRepository.getById(externalId);
				log.infov("found user with {0} for load users: {1}", externalId, user);
				if (user != null) {
					adapter = new AppUserAdapter(session, realm, model, user, userRepository);
					loadedUsers.put(externalId, adapter);
				}
			}
			return adapter;
		}

		@Override
		public UserModel getUserByUsername(String username, RealmModel realm) {
			UserModel adapter = loadedUsers.get(username);
			if (adapter == null) {
				session.userFederatedStorage().getStoredUsersStream(realm, 0, Integer.MAX_VALUE).forEach(user -> {
					log.infov("User in federated storage: {0}", user);
					log.infov("Attributes: {0}", session.userFederatedStorage().getAttributes(realm, user));
				});
				User user = userRepository.getByUsername(username);
				log.infov("found user with {0} for load users: {1}", username, user);
				if (user != null) {
					adapter = new AppUserAdapter(session, realm, model, user, userRepository);
					loadedUsers.put(username, adapter);
				}
			}
			return adapter;
		}

		@Override
		public UserModel getUserByEmail(String email, RealmModel realm) {
			UserModel adapter = loadedUsers.get(email);
			if (adapter == null) {
				session.userFederatedStorage().getStoredUsersStream(realm, 0, Integer.MAX_VALUE).forEach(user -> {
					log.infov("User in federated storage: {0}", user);
					log.infov("Attributes: {0}", session.userFederatedStorage().getAttributes(realm, user));
				});
				User user = userRepository.getByEmail(email);
				log.infov("found user with {0} for load users: {1}", email, user);
				if (user != null) {
					adapter = new AppUserAdapter(session, realm, model, user, userRepository);
					loadedUsers.put(email, adapter);
				}
			}
			return adapter;
		}

		public AppUserAdapter getUserAdapter(UserModel user) {
			AppUserAdapter adapter = null;
			if (user instanceof CachedUserModel) {
				adapter = (AppUserAdapter) ((CachedUserModel) user).getDelegateForUpdate();
			} else {
				adapter = (AppUserAdapter) user;
			}
			return adapter;
		}
}
