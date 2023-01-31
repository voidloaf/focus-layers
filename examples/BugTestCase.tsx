import * as React from "react";

import Dialog from "./Dialog";

export default function BugTestCase() {
  const [showDialog, setShowDialog] = React.useState(false);
  const [showHiddenEls, setShowHiddenEls] = React.useState(false);

  const [showAutofocus, setShowAutofocus] = React.useState(false);
  React.useEffect(() => {
    if (!showDialog) {
      setShowAutofocus(false);
      return;
    }

    setTimeout(() => setShowAutofocus(true), 500);
  }, [showDialog]);

  return (
    <div>
      <h1>Bug Test Case</h1>

      <p>
        Based on the "Simple Example". To reproduce the issue, follow these steps:
      </p>

      <ol>
        <li>Trigger the "Show Dialog" button</li>
        <li>Tab forwards and note that the focus layer wraps focus as expected, keeping the focus trapped within the dialog.</li>
        <li>Tab backwards and note that the focus escapes the focus layer, landing on the "Show Dialog" button outside the dialog.</li>
        <li>Tab forward back into the dialog and activate the "Toggle hidden elements" button, showing the previously hidden content.</li>
        <li>Tab backwards and forwards noting that the focus wraps around the dialog as expected, keeping focus trapped within it.</li>
      </ol>

      <p>
        This bug is a result of the tree walker filter not properly excluding elements that are considered not focuable. When the last or first "focusable" element in the focus layer (or any of its ancestors) have <code>display: none;</code>, <code>visiblity: hidden;</code>, etc, the focus trap within the focus layer will fail. In this example, a disclosure appearing at the bottom of the dialog hides the last focusable element. When tabbing in reverse, focus events are intercepted and <code>wrapFocus</code> is called when the focus is leaving the focus trap. This function will call <code>focus()</code> on the link inside the disclosure. This will fail if the disclosure component is collapsed, making the link unable to receive focus. Focus will then land outside the dialog's focus trap.
      </p>

      <p>
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
      </p>

      <div>
        <button onClick={() => setShowDialog(!showDialog)}>Show Dialog</button>
        {showDialog ? (
          <Dialog>
            <p>
              Showing this dialog traps focus within it. You can tab and click and do whatever, but
              focus will always remain inside this area. It also wraps around when you reach either
              end, as the ARIA spec prescribes.
            </p>
            <p>
              No focus emulation, no guard elements, no special properties, just raw event
              interception. Note that Tab order with positive tab indices is not preserved, but also
              you shouldn't be using positive tab indices anyway :eyes:
            </p>

            <div>
              <input type="text" />
              <a href="#linked">A link (not always tabbable)</a>
              <select>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
            <button>Button 4</button>
            {showAutofocus && <button autoFocus>Autofocused button</button>}
            <button>Button 6</button>
            <div>
              <button onClick={() => setShowDialog(false)}>Close Dialog</button>
            </div>

            <button 
              aria-controls='disclosure-menu' 
              aria-expanded={showHiddenEls} 
              role='button' 
              onClick={() => {setShowHiddenEls(!showHiddenEls)}}
            >
              Toggle hidden elements
            </button>
            <div style={{ display: `${showHiddenEls ? 'block' : 'none'}` }} id='disclosure-menu'>
              <p>
                Here is some text with an <a href="#">example link</a>.
              </p>
            </div>

          </Dialog>
        ) : null}
      </div>

      <p>
        <button>Button 7</button>
        <button>Button 8</button>
        <button>Button 9</button>
      </p>

    </div>
  );
}
