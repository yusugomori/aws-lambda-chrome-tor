export const platform = process.platform

export let os: 'win' | 'mac' | 'linux' | 'unknown' = 'unknown'

switch (platform) {
  case 'win32':
    os = 'win'
    break
  case 'darwin':
    os = 'mac'
    break
  case 'linux':
    os = 'linux'
    break
}

export default os
