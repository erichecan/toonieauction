# Playwright MCP Server Demo

This document demonstrates how to use the Playwright MCP server to automate browser interactions with the test HTML page.

## Step 1: Launch the Browser

First, launch a browser instance:

```javascript
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>launch_browser</tool_name>
<arguments>
{
  "headless": false
}
</arguments>
</use_mcp_tool>
```

## Step 2: Navigate to the Test Page

Navigate to the test HTML page:

```javascript
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>goto</tool_name>
<arguments>
{
  "url": "file:///Users/sophie/Desktop/eriche/toonieauction/playwright-test.html"
}
</arguments>
</use_mcp_tool>
```

## Step 3: Take a Screenshot of the Initial Page

Take a screenshot of the page before interacting with it:

```javascript
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>screenshot</tool_name>
<arguments>
{
  "fullPage": true
}
</arguments>
</use_mcp_tool>
```

## Step 4: Fill in the Form Fields

Type a name into the name field:

```javascript
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>type</tool_name>
<arguments>
{
  "selector": "#name",
  "text": "John Doe"
}
</arguments>
</use_mcp_tool>
```

Type an email into the email field:

```javascript
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>type</tool_name>
<arguments>
{
  "selector": "#email",
  "text": "john.doe@example.com"
}
</arguments>
</use_mcp_tool>
```

## Step 5: Submit the Form

Click the submit button:

```javascript
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>click</tool_name>
<arguments>
{
  "selector": "#submit-btn"
}
</arguments>
</use_mcp_tool>
```

## Step 6: Take a Screenshot After Submission

Take a screenshot after submitting the form:

```javascript
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>screenshot</tool_name>
<arguments>
{
  "fullPage": true
}
</arguments>
</use_mcp_tool>
```

## Step 7: Extract the Result Text

Extract the text from the result element:

```javascript
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>extract_text</tool_name>
<arguments>
{
  "selector": "#result"
}
</arguments>
</use_mcp_tool>
```

## Step 8: Close the Browser

Finally, close the browser:

```javascript
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>close_browser</tool_name>
<arguments>
{}
</arguments>
</use_mcp_tool>
```

## Advanced Example: Evaluate JavaScript

You can also evaluate JavaScript in the browser context:

```javascript
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>evaluate</tool_name>
<arguments>
{
  "expression": "document.querySelectorAll('input').length"
}
</arguments>
</use_mcp_tool>
```

This will return the number of input elements on the page.

## Conclusion

This demonstration shows how to use the Playwright MCP server to automate browser interactions. You can use these tools to automate various web tasks, such as filling out forms, taking screenshots, and extracting information from web pages.
