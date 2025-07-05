import Role from "../models/auth/Role.js";

class RoleMapper {
    static createRoleMapper(roleData) {
        return new Role({
            name: roleData.name,
            status: roleData.status
        });
    }
}

export default RoleMapper;
