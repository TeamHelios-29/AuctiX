package com.helios.auctix.domain.user;


import com.helios.auctix.repositories.UserRoleRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {

    public static Specification<User> getFilteredSpec(
            List<String> filterByList,
            List<List<String>> filterValues,
            UserRoleRepository userRoleRepository
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            for (int i = 0; i < filterByList.size(); i++) {
                String filterField = filterByList.get(i);
                List<String> values = filterValues.get(i);

                if ("role".equals(filterField)) {
                    List<UserRoleEnum> enumValues = values.stream()
                            .map(UserRoleEnum::valueOf)
                            .toList();

                    List<UserRole> roles = userRoleRepository.findByNameIn(enumValues);

                    CriteriaBuilder.In<UserRole> inClause = cb.in(root.get("role"));
                    for (UserRole role : roles) {
                        inClause.value(role);
                    }

                    predicates.add(inClause);
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}