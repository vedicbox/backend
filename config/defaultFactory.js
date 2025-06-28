import User from "../src/models/auth/User.js";
import Role from "../src/models/auth/Role.js";

class DefaultFactory {
    static async init() {
        try {
            await this.ensureAdministrationRole();
            await this.ensureAdministrationUser();
            console.log("Default factory initialization completed");
        } catch (error) {
            console.error("Initialization failed:", error);
            process.exit(1);
        }
    }

    static async ensureAdministrationRole() {
        const roleName = "ADMINISTRATION";
        const existingRole = await Role.findOne({ name: roleName });
        
        if (!existingRole) {
            const administrationRole = new Role({
                name: roleName,
                isActive: true
            });
            await administrationRole.save();
            console.log("Administration role created");
            return administrationRole;
        }
        return existingRole;
    }

    static async ensureAdministrationUser() {
        const administrationEmail = process.env.ADMINISTRATION_EMAIL;
        const administrationPassword = process.env.ADMINISTRATION_PASSWORD;
        const administrationFirstName = process.env.ADMINISTRATION_FIRSTNAME;
        const administrationLastName = process.env.ADMINISTRATION_LASTNAME;
        
        // Get administration role
        const administrationRole = await Role.findOne({ name: "ADMINISTRATION" });
        if (!administrationRole) {
            throw new Error("Administration role not found. Please ensure roles are initialized.");
        }

        const existingAdministrationUser = await User.findOne({ email: administrationEmail });
        if (!existingAdministrationUser) {
            const administrationUser = new User({
                email: administrationEmail,
                password: administrationPassword,
                firstName: administrationFirstName,
                lastName: administrationLastName,
                isActive: true,
                roleRef: administrationRole._id
            });

            await administrationUser.save();
            console.log("Administration user created:", administrationEmail);
        } else {
            // Update existing administration user if needed
            if (!existingAdministrationUser.roleRef || !existingAdministrationUser.isActive) {
                existingAdministrationUser.roleRef = administrationRole._id;
                existingAdministrationUser.isActive = true;
                await existingAdministrationUser.save();
                console.log("Administration user updated:", administrationEmail);
            } else {
                console.log("Administration user already exists:", administrationEmail);
            }
        }
    }
}

export default DefaultFactory;