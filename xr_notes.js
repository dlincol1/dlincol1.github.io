var url = document.URL;
var url_parts = url.split("/");
var url_string = url_parts[0];
var ip_port = url_parts[2];
var display_mode = 'VR_DISPLAY_STANDARD';
var marker_tracking = "False";

var red_annotation = "I'm excited to share that I will be speaking at #AU2024 this year...";
var green_annotation = "about how to use your Smartphone with VRED in Mixed Reality.";
var blue_annotation = "AU 2024 is in San Diego October 15–17.";
var orange_annotation = "I hope to see you there!\n\nSession:TR2977 #AU2024";

function submitPython() {
document.getElementById("FORM").action = url_string + '//' + ip_port + '/python?value=';
document.getElementById('PYTHON').value = python;
document.getElementById('FORM').submit();
}

// Toggle VRED Display modes, images and marker tracking On/Off
function vred_display_toggle() {
  var img = document.getElementById('logo');
  if (display_mode === 'VR_DISPLAY_STANDARD') {
    // setAnnotationText('Varjo marker tracking on.')
    img.src = "Images/varjo_marker_200_50mm.png"
    python = `setDisplayMode(VR_DISPLAY_VARJO)
print('Display mode: Varjo HMD MR')
vr_marker_tool = vrImmersiveUiService.findTool('vrMarkerTool')
vr_marker_tool.setChecked(True)
vr_marker_tool.signal().checked.emit(True)
vrHMDService.setXRRenderMode(vrXRealityTypes.XRRenderMode.ModelOnly)`;
display_mode = 'VR_DISPLAY_VARJO';
} else if (display_mode === 'VR_DISPLAY_VARJO') {
    // setAnnotationText('Varjo marker tracking off.');
    img.src = "autodesk-profile-icon-280x280.png"
python = `setDisplayMode(VR_DISPLAY_STANDARD)
print('Display mode: Standard')
vr_marker_tool = vrImmersiveUiService.findTool('vrMarkerTool')
vr_marker_tool.setChecked(False)
vr_marker_tool.signal().unchecked.emit(True)`
display_mode = 'VR_DISPLAY_STANDARD'; }
submitPython();
}

function annotation_create(color) {
  if (color === 'red') { var note_color_x = 1.0; var note_color_y = 0.0; var note_color_z = 0.0;
  } else if (color === 'green') { var note_color_x = 0.0; var note_color_y = 1.0; var note_color_z = 0.0;
  } else if (color === 'blue') { var note_color_x = 0.0; var note_color_y = 0.05; var note_color_z = 1.0;
  } else if (color === 'orange') { var note_color_x = 0.9; var note_color_y = 0.50; var note_color_z = 0.05;
  } else { var note_color_x = 1.0; var note_color_y = 1.0; var note_color_z = 1.0; }
  field_text = document.getElementById('TEXTAREA').value;
  var regex = /[\r\n\x0B\x0C\u0085\u2028\u2029]+/g;
  var regex = /[\r\n\x0B\x0C]+/g;
  var clean_text = field_text.replace(regex, '\\n');
  line_break_text = addWordNewLine(clean_text);
  // var timestamp = new Date().toLocaleDateString();
  // timestamp = timestamp.replace(', ', '\\n');
  var note_text = (line_break_text);
python = `varjo_marker = vrImmersiveInteractionService.getMarker('200', vrXRealityTypes.MarkerTypes.VarjoMarker)
varjo_marker_node = varjo_marker.getNode()
pivot = vrMathService.getTranslation(varjo_marker_node.getWorldTransform())
note = vrAnnotationService.createAnnotation('XR Annotation')
note.setPosition(QVector3D(pivot.x(), pivot.y(), pivot.z()))
note.setText("${note_text}")
note.setSize(0.20)
new_note_color = QColor()
new_note_color.setRgbF(${note_color_x}, ${note_color_y}, ${note_color_z}, 1.0)
note.setLineColor(new_note_color)
print(f'Creating Annotation at: {pivot}')
vrAnnotationService.setShowAnnotations(True)`
submitPython();
}

// Delete the last annotation
function annotation_delete() {
  setAnnotationText(' ');
  python = `notes = vrAnnotationService.getAnnotations()
if notes:
    print('Deleting last Annotation.')
    vrAnnotationService.deleteAnnotation(notes[-1])`
submitPython();
}

// Reposition last annotation to marker location
function annotation_reposition() {
  python = `notes = vrAnnotationService.getAnnotations()
print('Repositioning last Annotation.')
last_note = notes[-1]
varjo_marker = vrImmersiveInteractionService.getMarker('200', vrXRealityTypes.MarkerTypes.VarjoMarker)
varjo_marker_node = varjo_marker.getNode()
pivot = vrMathService.getTranslation(varjo_marker_node.getWorldTransform())
note.setPosition(QVector3D(pivot.x(), pivot.y(), pivot.z()))`
submitPython();
}

// Toggle Annotations on/off
function annotation_toggle() {
  python = `note_state = vrAnnotationService.getShowAnnotations()
if note_state: vrAnnotationService.setShowAnnotations(False); print('Annotations Off.')
else: vrAnnotationService.setShowAnnotations(True); print('Annotations On.')`
submitPython();
}

// Toggle VR Menu on/off
function toggle_vr_menu() {
  python = `vr_menu = vrImmersiveUiService.findMenu('ToolsMenu')
vrImmersiveUiService.toggleToolsMenu(True)
vr_menu.attachTo(3,1)
vr_menu.setTranslation(0,600,80)
vr_menu.setRotation(0,0,0)
vr_menu.attachTo(2,1)
print('VR Menu toggle.')`
submitPython();
}

// Simulate AI typing in textarea
function setAnnotationText(text_string, border_color, note_color) {
  active_color = note_color;
  var x = document.getElementById("TEXTAREA");
  x.style.borderColor = border_color;
  var n = 0;
  x.value = '';
  (function loop() {
  x.value += text_string[n];
  if (++n < text_string.length) {
    setTimeout(loop, 32);
  } })();
}

// Insert a linebreak after x number of characters
function addWordNewLine(str, breakpoint = 28) {
  var words = str.split(" ");
  var numChars = 0;
  for (var i = 0; i < words.length; i++) {
    numChars += words[i].length;
    if (numChars >= breakpoint) {
      words[i] += "\\n";
      numChars = 0; }
  }
  return words.join(" ");
}

function get_active_color() {
  return active_color;
}