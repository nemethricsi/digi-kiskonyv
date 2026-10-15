export const ATTENDANCE_METHODS = ['manual', 'code'] as const;
export type AttendanceMethod = (typeof ATTENDANCE_METHODS)[number];

export const ATTENDANCE_METHOD_LABELS: Record<AttendanceMethod, string> = {
  manual: 'Kézi rögzítés',
  code: 'Állampolgári kóddal',
};

/** Set in `req.context` when the attendance is created by redeeming a check-in code */
export const FROM_CHECK_IN_CODE = 'fromCheckInCode';
