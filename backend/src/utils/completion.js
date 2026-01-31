const calculateCompletion = (user) => {
  let total = 0;
  let filled = 0;

  // Profile fields (including new contact fields)
  const fields = [
    user.name,
    user.username,
    user.role,
    user.bio,
    user.linkedIn,
    user.github,
    user.portfolio,
    user.location,
  ];

  total += fields.length;
  filled += fields.filter((value) => Boolean(value && String(value).trim())).length;

  total += 1;
  filled += Array.isArray(user.skills) && user.skills.length > 0 ? 1 : 0;

  total += 1;
  filled += Array.isArray(user.projects) && user.projects.length > 0 ? 1 : 0;

  total += 1;
  filled += Array.isArray(user.experience) && user.experience.length > 0 ? 1 : 0;

  return Math.round((filled / total) * 100);
};

module.exports = { calculateCompletion };
