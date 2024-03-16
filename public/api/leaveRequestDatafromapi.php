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

We would like to bring to your attention that a leave request has been submitted by " . $user['FirstName'] . ".

Please take a moment to review the details on the leave website and kindly provide your decision by either approving or declining the request.

Your prompt attention to this matter is greatly appreciated.

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
            $user = json_decode(file_get_contents('php://input'), true);
            $portal = $_GET['portal'];
            if($portal == 'Approver')
            {
                $requestId = $_GET['requestId'];
                $sql = "SELECT * FROM emprequest WHERE EmployeeID = :requestId";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':requestId', $requestId);
            }
            else if($portal == 'Employee')
            {
                $employeeEmail = $_GET['EmployeeEmail'];
                $sql = "SELECT * FROM emprequest WHERE Email = :employeeEmail";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':employeeEmail', $employeeEmail);
            }
            else{
                $approverEmail = $_GET['ApproverEmail'];
                $sql = "SELECT * FROM emprequest WHERE LeaveApprover = :approvermail";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':approvermail', $approverEmail);
            }

            if ($stmt->execute()) {
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = ['status' => 1, 'data' => $data];
                echo json_encode($response);
            } else {
                $response = ['status' => 0, 'message' => 'Failed to retrieve records.'];
                echo json_encode($response);
            }
        }
        catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;

        case "DELETE":
            try {
                $data = json_decode(file_get_contents('php://input'), true);
                $emprequestId = $_GET['emprequestId'];

                $sql = "DELETE FROM emprequest WHERE EmployeeID=:emprequestId";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':emprequestId', $emprequestId);

                if ($stmt->execute()) {
                    $response = ['status' => 1, 'message' => "Successful"];
                    echo json_encode($response);
                } else {
                    http_response_code(500);
                    echo json_encode(['status' => 0, 'message' => 'Failed to delete request']);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
            }
            break;
             

}
?>
