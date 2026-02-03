update app.json to fix android from keyboard to modify layout which gives bad ux
```json
{
  "expo": {
    "android": {
      "softwareKeyboardLayoutMode": "pan"
    }
  }
}
```
