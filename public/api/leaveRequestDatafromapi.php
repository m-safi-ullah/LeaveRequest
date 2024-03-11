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
            $targetDirectory = "uploads/";

            if (!is_dir($targetDirectory)) {
                mkdir($targetDirectory, 0777, true);
            }

            $empID = uniqid();
            $user = $_POST; 

            $documentImg = $_FILES['DocumentImg']['name'];
            $documentImgPath = $targetDirectory . $documentImg;

            if (move_uploaded_file($_FILES['DocumentImg']['tmp_name'], $documentImgPath)) {
                
                $sql = "INSERT INTO emprequest (EmployeeID, FirstName, LastName, Email, LeaveType, FDate, LDate, LeaveApprover, DocumentImg, Comments)
                        VALUES (:empID, :FirstName, :LastName, :Email, :LeaveType, :FDate, :LDate, :LeaveApprover, :DocumentImg, :Comments)";
                $stmt = $conn->prepare($sql);

                $stmt->bindParam(':empID', $empID);
                $stmt->bindParam(':FirstName', $user['FirstName']);
                $stmt->bindParam(':LastName', $user['LastName']);
                $stmt->bindParam(':Email', $user['Email']);
                $stmt->bindParam(':LeaveType', $user['LeaveType']);
                $stmt->bindParam(':FDate', $user['FDate']);
                $stmt->bindParam(':LDate', $user['LDate']);
                $stmt->bindParam(':LeaveApprover', $user['LeaveApprover']);
                $stmt->bindParam(':DocumentImg', $documentImg);
                $stmt->bindParam(':Comments', $user['Comments']);

                $emailContent = "Dear Approver,
This is to inform you that a leave request has been submitted by " . $user['FirstName'] . ".

Kindly review the details and provide your decision by either approving or rejecting the request through the following link:

https://leaverequest.socialvidify.com/review-request?requestId=$empID

Your prompt attention to this matter is highly appreciated.

Best regards,
Catering Industries";


                $headers = "From: info@cateringindustries.com";
                $to = $user['LeaveApprover'];
                $subject = "Requested Leave";

                if ($stmt->execute()) {
                    if (mail($to, $subject, $emailContent, $headers)) {
                        $response = ['status' => 1, 'message' => 'Successfully'];
                    } else {
                        $response = ['status' => 0, 'message' => 'Successfully updated, but failed to send email.'];
                    }
                } else {
                    $response = ['status' => 0, 'message' => 'Failed to create record.'];
                }
                echo json_encode($response);
            } else {
                // Failed to move the uploaded file
                $response = ['status' => 0, 'message' => 'Failed to move uploaded file.', 'error' => $_FILES['DocumentImg']['error']];
                echo json_encode($response);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;

    case "GET":
        try {
            $requestId = $_GET['requestId'];
            $sql = "SELECT * FROM emprequest WHERE EmployeeID = :requestId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':requestId', $requestId);

            if ($stmt->execute()) {
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = ['status' => 1, 'data' => $data];
                echo json_encode($response);
            } else {
                $response = ['status' => 0, 'message' => 'Failed to retrieve records.'];
                echo json_encode($response);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;                      

}
?>
