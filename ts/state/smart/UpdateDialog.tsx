// Copyright 2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { useSelector } from 'react-redux';
import React, { memo } from 'react';
import { DialogUpdate } from '../../components/DialogUpdate';
import { getIntl } from '../selectors/user';
import type { WidthBreakpoint } from '../../components/_util';
import { useUpdatesActions } from '../ducks/updates';
import {
  getUpdateDialogType,
  getUpdateDownloadSize,
  getUpdateDownloadedSize,
  getUpdateVersion,
} from '../selectors/updates';
import { DialogType } from '../../types/Dialogs';

type SmartUpdateDialogProps = Readonly<{
  containerWidthBreakpoint: WidthBreakpoint;
  disableDismiss?: boolean;
}>;

export const SmartUpdateDialog = memo(function SmartUpdateDialog({
  containerWidthBreakpoint,
  disableDismiss,
}: SmartUpdateDialogProps) {
  const i18n = useSelector(getIntl);
  const { dismissDialog, snoozeUpdate, startUpdate } = useUpdatesActions();
  const dialogType = useSelector(getUpdateDialogType);
  const downloadSize = useSelector(getUpdateDownloadSize);
  const downloadedSize = useSelector(getUpdateDownloadedSize);
  const version = useSelector(getUpdateVersion);

  const shouldDisableDismiss =
    disableDismiss &&
    dialogType !== DialogType.Cannot_Update &&
    dialogType !== DialogType.Cannot_Update_Require_Manual &&
    dialogType !== DialogType.MacOS_Read_Only &&
    dialogType !== DialogType.UnsupportedOS;

  return (
    <DialogUpdate
      i18n={i18n}
      containerWidthBreakpoint={containerWidthBreakpoint}
      dialogType={dialogType}
      downloadSize={downloadSize}
      downloadedSize={downloadedSize}
      version={version}
      currentVersion={window.getVersion()}
      dismissDialog={dismissDialog}
      disableDismiss={shouldDisableDismiss}
      snoozeUpdate={snoozeUpdate}
      startUpdate={startUpdate}
    />
  );
});
