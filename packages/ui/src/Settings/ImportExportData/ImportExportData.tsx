import { Button } from '@mui/material';
import { isString } from 'lodash-es';
import { EDbStores } from 'storage/EDbStores';
import { getDb } from 'storage/storage';
import { SK } from 'storage/storageKeys';

export const ImportExportData = () => {
  const exportData = async () => {
    const resultDb = getDb(EDbStores.RESULT_STORE_NAME);

    // TODO download to file
    console.log(await resultDb.getItem(SK.RESULT.LIST));
  };

  const importData = async () => {
    // TODO call dialog.showOpenDialog, get filename and use Node's fs.readFile to read it from disk in the main process, then forward contents to this function
    // See https://github.com/electron/electron/blob/v0.36.9/docs/api/dialog.md#dialogshowopendialogbrowserwindow-options-callback
    //
    // const resultDb = getDb(EDbStores.RESULT_STORE_NAME);
    // resultDb.setItem(SK.RESULT.LIST, JSON.parse(event.target.result));
  };

  return (
    <div className="flex gap-2">
      <Button color="secondary" onClick={exportData}>
        Export data
      </Button>

      <Button color="secondary" onClick={importData}>
        Import data
      </Button>
    </div>
  );
};
