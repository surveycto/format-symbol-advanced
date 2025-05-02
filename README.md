# Advanced format symbol

![Screenshot](extras/format-symbol.png)

## Description

This field plug-in displays symbols before, after, or below an input field with flexible layout options. It allows for precise control over symbol placement and sizing, making it ideal for formatting monetary values, measurements, or any data that requires consistent presentation.

[![Download now](extras/download-button.png)](https://github.com/surveycto/format-symbol/raw/master/format-symbol.fieldplugin.zip)

### Features

1. Add symbols to the left, right, or below the input field
2. Control the width allocated to symbols
3. Flexible layout that adapts to both short and long symbol text
4. Proper text wrapping and vertical alignment of all elements

This field plug-in also inherits functionality from the [baseline-decimal](https://github.com/surveycto/baseline-decimal) field plug-in.

### Data format

This field plug-in requires the `decimal` field type.

## How to use

### Getting started

**To use this plug-in as-is**

1. Download the [sample form](https://github.com/surveycto/format-symbol-advanced/raw/master/extras/sample-form/Sample%20form%20-%20Format%20symbol%20advanced%20field%20plug-in.xlsx) from this repo and upload it to your SurveyCTO server.
2. Download the [format-symbol-advanced.fieldplugin.zip](https://github.com/surveycto/format-symbol-advanced/raw/master/format-symbol-advanced.fieldplugin.zip) file from this repo, and attach it to the sample form on your SurveyCTO server.

### Parameters

| Parameter key | Parameter value |
| --- | --- |
| `left` | Text/symbol to display to the left of the input field (optional) |
| `right` | Text/symbol to display to the right of the input field (optional) |
| `below` | Text/symbol to display below the input field (optional) |
| `symbol-width` | Controls the width allocated to symbols. Can be:<br>- `half` (50%)<br>- `third` (33.33%)<br>- `quarter` (25%)<br>- `two-thirds` (66.67%)<br>- A custom percentage value (e.g., `40` for 40%)<br>If not specified, symbols will take their natural width up to 33% each |

### Example

To display a currency symbol on the left and a unit on the right:
```
custom-format-symbol-advanced(left='$', right='per kg')
```

To display a currency symbol below with a wider symbol area:
```
custom-format-symbol-advanced(below='All prices in USD', symbol-width='half')
```

To display a longer explanation with more space:
```
custom-format-symbol-advanced(right='charges apply to this amount', symbol-width='two-thirds')
```

### Default SurveyCTO feature support

| Feature / Property | Support |
| --- | --- |
| Supported field type(s) | `decimal`|
| Default values | Yes |
| Constraint message | Uses default behavior |
| Required message | Uses default behavior |
| media:image | Yes |
| media:audio | Yes |
| media:video | Yes |
| `show-formatted` appearance | No |

## More resources

* **Sample form**   
[Download sample form](https://github.com/surveycto/format-symbol/raw/master/extras/sample-form/Sample%20form%20-%20Format%20symbol%20field%20plug-in.xlsx)  

* **Developer documentation**  
Instructions and resources for developing your own field plug-ins.  
[https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)

* **User documentation**  
How to get started using field plug-ins in your SurveyCTO form.  
[https://docs.surveycto.com/02-designing-forms/03-advanced-topics/06.using-field-plug-ins.html](https://docs.surveycto.com/02-designing-forms/03-advanced-topics/06.using-field-plug-ins.html)
