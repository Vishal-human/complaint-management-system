const User = require('../models/User');

const initSuperAdmin = async () => {
  try {
    const superAdminExists = await User.findOne({ role: 'superadmin' });
    
    if (!superAdminExists) {
      const superAdmin = new User({
        name: 'Super Admin',
        email: 'superadmin@cms.com',
        password: 'SuperAdmin@123',
        role: 'superadmin'
      });
      
      await superAdmin.save();
      console.log('✅ Super Admin created successfully!');
      console.log('📧 Email: superadmin@cms.com');
      console.log('🔑 Password: SuperAdmin@123');
      console.log('⚠️  Please change the password after first login!');
    } else {
      console.log('✅ Super Admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error.message);
  }
};

module.exports = initSuperAdmin;
