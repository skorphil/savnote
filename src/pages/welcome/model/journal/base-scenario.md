1. User creates new journal:
App asks for meta information: `password`, `journalName`,
App prompts user to select target file (for now only $Home directory is supported)
After user submits this info, app generates `salt`, `iv`, `iterations` and derives `encryption password`
The Journal instace created with 
- `meta` (`iv`, `name`...)
- `encryption password`
- `uri`
- `data = null`
Journal instance saved to file

2. User opens encrypted journal
App prompts to select file
App reads file structure
App verifying selected file (at this moment we can understand if its encrypted)
*Workaround*: app asks for location to save the file.
```
// deriveEncryptionPassword(password, iv, salt, iterations)
App asks for: `password`
App derives `encryption password`
```
```
// decrypt(cipher, encryptionPassword)
App decrypts `cipher-data`
```
App creates Journal instance with 
- `meta` from original file
- `data` from original file
- `encryption password`
- `uri`
Journal instance saved to file
```
saveToFile()
if encrypted -> encrypt(`encription password`)
```

3. User opens decrypted journal
App prompts to select file
App reads file structure
App verifying selected file (at this moment we can understand if its encrypted)
*Workaround*: app asks for location to save the file.
App prompting to encrypt or open

Open: 
App creates Journal instance with `meta`, `data` from original file, `encryption password = null` and `uri`
Journal instance saved to file

Encrypt: 
App asks for: `password`
App generates `salt`, `iv`, `iterations` and derives `encryption password`
App creates Journal instance with `meta`, `data` from original file, `encryption password` and `uri`
Journal instance saved to file
if instance already exist:
App asks for: `password`
App generates `salt`, `iv`, `iterations` and derives `encryption password`, 
App save `salt`, `iv`, `iterations` in existing journal instance
Journal instance saved to file
```
saveToFile()
if encryptionPasssword != null -> encrypt(`encryption password`)
```