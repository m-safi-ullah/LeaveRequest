<?php
include 'DbConnect.php';

$dbConnection = new DbConnect();
$conn = $dbConnection->db();
if (!$conn) {
    die("Database connection failed");
}

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case "POST":
        try {
            $Response = $_GET['Response'];
            $requestId = $_GET['requestId'];
            $user = json_decode(file_get_contents('php://input'), true);
            if($Response == 'Approve')
            {
                $sql = "UPDATE emprequest SET ButtonType = 'Disable', leaveStatus='Completed' , RequestStatus = 'Approved' WHERE EmployeeID = :requestId";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':requestId', $requestId);
                $emailContent = "Dear " . $user['FirstName'] . ",

I am pleased to inform you that your leave application request has been approved. 
Congratulations!

If you have any further questions or need additional information, please don't hesitate to reach out.

Best regards,
Catering Industries";
            }
            else{
                $sql = "UPDATE emprequest SET ButtonType = 'Disable' , leaveStatus='Completed' , RequestStatus='Declined' WHERE EmployeeID = :requestId";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':requestId', $requestId);
                $emailContent = "Dear " . $user['FirstName'] . ",
I hope this message finds you well. I regret to inform you that your recent leave application request has been rejected.

Feedback from Approver:
" . $user['Rejecttext'] . "

If you have any questions or require further clarification, please do not hesitate to reach out.

Best regards,
Catering Industries
";
            }

            $headers = "From: info@cateringindustries.com";
            $to = $user['Email'];
            $subject = "Leave Request Form";

            if ($stmt->execute()) {
                $rowCount = $stmt->rowCount();

                if ($rowCount > 0) {
                    if (mail($to, $subject, $emailContent, $headers)) {
                        $response = ['status' => 1, 'message' => 'Successfully updated and email sent.'];
                        echo json_encode($response);
                    } else {
                        $response = ['status' => 0, 'message' => 'Successfully updated, but failed to send email.'];
                        echo json_encode($response);
                    }
                } else {
                    $response = ['status' => 0, 'message' => 'No records updated.'];
                    echo json_encode($response);
                }
            } else {
                $response = ['status' => 0, 'message' => 'Failed to update records.'];
                echo json_encode($response);
            }

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;                   

}
?>
