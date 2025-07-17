package com.helios.auctix.services.user;

import com.helios.auctix.domain.user.*;
import com.helios.auctix.dtos.AdminActionDTO;
import com.helios.auctix.dtos.UserDTO;
import com.helios.auctix.mappers.impl.AdminActionMapperImpl;
import com.helios.auctix.repositories.AdminActionRepository;
import com.helios.auctix.repositories.AdminRepository;
import com.helios.auctix.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AdminActionService {

    private final AdminActionRepository adminActionRepository;
    private final UserRepository userRepository;
    private final AdminActionMapperImpl adminActionMapperImpl;

    public AdminActionService(
            AdminActionRepository adminActionRepository,
            UserRepository userRepository, AdminActionMapperImpl adminActionMapperImpl) {
        this.adminActionRepository = adminActionRepository;
        this.userRepository = userRepository;
        this.adminActionMapperImpl = adminActionMapperImpl;
    }

    public void logAdminAction(User admin, User user, AdminActionsEnum action, String description) {

        if (admin == null || user == null || action == null) {
            log.error("Admin, User, or Action cannot be null");
            throw new IllegalArgumentException("Admin, User, and Action must not be null");
        }
        if(!admin.getRoleEnum().equals(UserRoleEnum.SUPER_ADMIN) && !admin.getRoleEnum().equals(UserRoleEnum.ADMIN)) {
            log.error("not an admin user");
            throw new IllegalArgumentException("only admin can be log actions");
        }
        Admin adminDetails = admin.getAdmin();
        if(admin.getRoleEnum().equals(UserRoleEnum.SUPER_ADMIN)){
            adminDetails = Admin.builder()
                            .id(admin.getId())
                            .user(admin)
                            .isActive(true)
                            .build();
        }

        // TODO: Register SuperAdmin as a Admin and save superadmin actions
        AdminAction adminAction = AdminAction.builder()
                .admin(adminDetails)
                .user(user)
                .activityType(action)
                .description(description)
                .build();

        adminActionRepository.save(adminAction);
        log.info("Admin Action has been saved successfully");

    }

    public List<AdminAction> findAllByUser(User currentUser) {

        List<AdminAction> actions = adminActionRepository.findAllByOrderByCreatedAtDesc(Pageable.ofSize(100));
        log.info("Retrieved {} admin actions for user {}", actions.size(), currentUser.getUsername());
        return actions;
    }

    /**
     * Retrieves a page of admin actions.
     *
     * @param limit required, no default \- number of records per page
     * @param offset required, no default \- page number or starting index
     * @param search not required, default is null \- search keyword, can be null
     * @param actionTypeFilter not required, default is null \- filter by action type, can be null
     * @param order required, no default \- sort order ("asc" or "desc")
     * @return a page of AdminActionDTO
     */
    public Page<AdminActionDTO> getAllAdminActions(int limit, int offset, String search, String actionTypeFilter, String order) {
        Sort sort = order.equalsIgnoreCase("asc") ? Sort.by("createdAt").ascending() : Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(offset, limit, sort);

        Set<UUID> matchedUserIds = Set.of();
        String descriptionSearch = null;

        AdminActionsEnum actionTypeFilterEnumVal = AdminActionsEnum.valueOf(actionTypeFilter);

        if (search != null && search.toLowerCase().contains("username:")) {
            String lowerSearch = search.toLowerCase();
            int index = lowerSearch.indexOf("username:");

            int endOfUsername = search.indexOf(' ', index);
            String usernameKeyword;
            if (endOfUsername == -1) {
                usernameKeyword = search.substring(index + "username:".length()).trim();
                descriptionSearch = search.substring(0, index).trim();
            } else {
                usernameKeyword = search.substring(index + "username:".length(), endOfUsername).trim();
                descriptionSearch = (search.substring(0, index) + search.substring(endOfUsername)).trim();
            }

            matchedUserIds = getMatchedUserIds(usernameKeyword);
        } else if (search != null) {
            descriptionSearch = search;
        }

        Page<AdminAction> adminActions;

        if (matchedUserIds != null && !matchedUserIds.isEmpty()) {
            adminActions = adminActionRepository.searchAdminActions( new ArrayList<>(matchedUserIds), descriptionSearch, actionTypeFilterEnumVal, pageable);
        } else {
            adminActions = adminActionRepository.findByDescriptionContainingIgnoreCaseAndActivityType(pageable, descriptionSearch, actionTypeFilterEnumVal);
        }

        log.info("Retrieved {} admin actions with limit {}, offset {}, order {}, sortBy createdAt, search {}, filterBy activity_type, filterValue {}",
                adminActions.getTotalElements(), limit, offset, order, search, actionTypeFilter);

        log.info("mapping to dto");
        Page<AdminActionDTO> adminActionsDTOPage = adminActions.map(adminActionMapperImpl::mapTo);

        return adminActionsDTOPage;
    }

    public Set<UUID> getMatchedUserIds(String usernameKeyword) {
        return userRepository
                .findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(usernameKeyword,usernameKeyword)
                .stream()
                .map(user -> ((User) user).getId())
                .collect(Collectors.toSet());
    }

}

