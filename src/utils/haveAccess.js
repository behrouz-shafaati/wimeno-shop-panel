export default function haveAcceshaveAccess(user, access = []) {
  if (access.length === 0) {
    // don't need access
    return true;
  }
  if (typeof access === 'string' && user?.accesses.includes(access)) return true;
  for (let i = 0; i < access.length; i += 1) if (user?.accesses.includes(access[i])) return true;
  return false;
}
