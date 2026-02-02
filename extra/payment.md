# 1. psychological threat user 
- udanganyifu wa aina yoyote huweza kusababisha app ku crash na kupoteza kumbukumbu zote

# 2. ID
- Ambatanisha physical device ID with token to avoid another user to use it for replay attacks
- Update secret on every app update


# Time-based attacks
- On every app start record time and compare with last app start, if last starttime > recent start time
this user has tempered with time block the app. 

# Encrypt
- Hide sensitive data like expire date use HMAC signature for sqlite tempering
```ini
signature = HMAC(secret, record_id + amount + timestamp);
```

avoid replay attacks (re-using valid code again)

## Online verification (Extreme security) even for APK reverse engineering every 14 days
# this is also critical and admin can mark device if valid or not from remote server
- Mark user if paid using hardware ID and able to verify if you see some attacks 
- if above 14 days force the user to be online with message
"Sorry for disturbance but we need internet connection for security check"

## 14 days trial
- for user to study, practise and understand system well without paying.

# on playstore build 
- Unapo-build app kwa ajili ya Play Store, tumia ProGuard au zana za kuficha code (Obfuscation).