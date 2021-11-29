import { ChangeEvent, useEffect, useRef, useState } from "react";
import type { ActionFunction } from "remix";
import { Form, json, useActionData, redirect } from "remix";

export function meta() {
  return { title: "Trello Data Upload" };
}

// When your form sends a POST, the action is called on the server.
// - https://remix.run/api/conventions#action
// - https://remix.run/guides/data-updates
export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let file = formData.get("file");

  // Typical action workflows start with validating the form data that just came
  // over the network. Clientside validation is fine, but you definitely need it
  // server side.  If there's a problem, return the the data and the component
  // can render it.
  if (typeof file !== "string") {
    return json("Come on, at least try!", { status: 400 });
  }

  if (file !== "egg") {
    return json(`Sorry, ${file} is not right.`, { status: 400 });
  }

  // Finally, if the data is valid, you'll typically write to a database or send or
  // email or log the user in, etc. It's recommended to redirect after a
  // successful action, even if it's to the same place so that non-JavaScript workflows
  // from the browser doesn't repost the data if the user clicks back.
  return redirect("/demos/correct");
};

export default function Upload() {
  // https://remix.run/api/remix#useactiondata
  let actionMessage = useActionData<string>();
  let fileHiddenRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>();
  const [selectedFileText, setSelectedFileText] = useState<string>("");

  const onFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = (event?.target?.files) ? event.target.files[0] : null;
    setSelectedFile(file);
  }

  useEffect(() => {
    if (!selectedFile) {
      setSelectedFileText("");
      return;
    }

    selectedFile
      .text()
      .then((text) => {
        setSelectedFileText(text);
      });
  }, [selectedFile]);

  useEffect(() => {
    if (!fileHiddenRef.current) {
      return;
    }

    if (!selectedFileText) {
      fileHiddenRef.current.value = '';
      return;
    }

    fileHiddenRef.current.value = selectedFileText;
  }, [selectedFileText, fileHiddenRef]);

  return (
    <div className="remix__page">
      <main>
        <h2>Actions!</h2>
        <p>
          This form submission will send a post request that we handle in our
          `action` export. Any route can export an action to handle data
          mutations.
        </p>
        <Form method="post" className="remix__form">
          <h3>Post an Action</h3>
          <label>
            <div>Trello data file:</div>
            <input type="file" onChange={onFileSelected} />
            <input ref={fileHiddenRef} type="hidden" name="file" accept=".json, application/json" />
          </label>
          <div>
            <button>Upload!</button>
          </div>
          {selectedFileText ? (
            <pre>{JSON.stringify(JSON.parse(selectedFileText), null, 2)}</pre>
          ) : null}
          {actionMessage ? (
            <p>
              <b>{actionMessage}</b>
            </p>
          ) : null}
        </Form>
      </main>

      <aside>
        <h3>Additional Resources</h3>
        <ul>
          <li>
            Guide:{" "}
            <a href="https://remix.run/guides/data-writes">Data Writes</a>
          </li>
          <li>
            API:{" "}
            <a href="https://remix.run/api/conventions#action">
              Route Action Export
            </a>
          </li>
          <li>
            API:{" "}
            <a href="https://remix.run/api/remix#useactiondata">
              <code>useActionData</code>
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
}